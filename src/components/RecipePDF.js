import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { useState, useEffect } from 'react';

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica',
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
        color: '#1a73e8',
    },
    meta: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 15,
        color: '#666',
        fontSize: 12,
    },
    image: {
        width: '100%',
        height: 200,
        objectFit: 'cover',
        marginBottom: 20,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        marginBottom: 10,
        color: '#1a73e8',
    },
    ingredientsList: {
        marginBottom: 15,
    },
    ingredient: {
        fontSize: 12,
        marginBottom: 5,
    },
    instruction: {
        fontSize: 12,
        marginBottom: 10,
        flexDirection: 'row',
        gap: 10,
    },
    stepNumber: {
        color: '#1a73e8',
        fontWeight: 'bold',
    },
    ingredientsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 20,
    },
    ingredientCard: {
        width: '30%',
        padding: 10,
        backgroundColor: '#f8f9fa',
        borderRadius: 5,
        alignItems: 'center',
    },
    ingredientImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 5,
    },
    instructionImage: {
        width: '100%',
        height: 200,
        objectFit: 'cover',
        marginTop: 10,
        borderRadius: 5,
    }
});

function RecipePDF({ recipe }) {
    const [imageData, setImageData] = useState(null);
    const [ingredientImages, setIngredientImages] = useState({});
    const [instructionImages, setInstructionImages] = useState({});

    useEffect(() => {
        const fetchImages = async () => {
            try {
                // Fetch main recipe image
                const corsProxy = 'https://corsproxy.io/?';
                const imageUrl = recipe.media.images[2].image;
                const response = await fetch(corsProxy + encodeURIComponent(imageUrl));
                const blob = await response.blob();
                const mainImageData = await blobToBase64(blob);
                setImageData(mainImageData);

                // Fetch ingredient images
                const ingredientPromises = recipe.ingredients.map(async (ingredient) => {
                    if (ingredient.media?.images?.[0]?.image) {
                        const response = await fetch(corsProxy + encodeURIComponent(ingredient.media.images[0].image));
                        const blob = await response.blob();
                        const base64 = await blobToBase64(blob);
                        return [ingredient.uid, base64];
                    }
                    return null;
                });

                // Fetch instruction images
                const instructionPromises = recipe.cooking_instructions.map(async (instruction) => {
                    if (instruction.media?.images?.[0]?.image) {
                        const response = await fetch(corsProxy + encodeURIComponent(instruction.media.images[0].image));
                        const blob = await response.blob();
                        const base64 = await blobToBase64(blob);
                        return [instruction.order, base64];
                    }
                    return null;
                });

                const ingredientResults = await Promise.all(ingredientPromises);
                const instructionResults = await Promise.all(instructionPromises);

                const ingredientImagesMap = Object.fromEntries(ingredientResults.filter(Boolean));
                const instructionImagesMap = Object.fromEntries(instructionResults.filter(Boolean));

                setIngredientImages(ingredientImagesMap);
                setInstructionImages(instructionImagesMap);
            } catch (error) {
                console.error('Error loading images:', error);
            }
        };

        fetchImages();
    }, [recipe]);

    const blobToBase64 = (blob) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>{recipe.title}</Text>

                <View style={styles.meta}>
                    <Text>⏱️ {recipe.prep_times.for_2} mins</Text>
                    <Text>⭐ {recipe.rating.average}/5</Text>
                </View>

                {imageData && (
                    <Image
                        style={styles.image}
                        src={imageData}
                    />
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ingredients</Text>
                    <View style={styles.ingredientsGrid}>
                        {recipe.ingredients.map((ingredient) => (
                            <View key={ingredient.uid} style={styles.ingredientCard}>
                                {ingredientImages[ingredient.uid] && (
                                    <Image
                                        style={styles.ingredientImage}
                                        src={ingredientImages[ingredient.uid]}
                                    />
                                )}
                                <Text style={styles.ingredient}>{ingredient.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Instructions</Text>
                    {recipe.cooking_instructions.map((step) => (
                        <View key={step.order} style={styles.instruction}>
                            <Text style={styles.stepNumber}>{step.order}.</Text>
                            <View style={{ flex: 1 }}>
                                <Text>{step.instruction.replace(/<[^>]*>/g, '')}</Text>
                                {instructionImages[step.order] && (
                                    <Image
                                        style={styles.instructionImage}
                                        src={instructionImages[step.order]}
                                    />
                                )}
                            </View>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
}

export default RecipePDF; 