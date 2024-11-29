import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { useState, useEffect } from 'react';

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontFamily: 'Helvetica',
    },
    title: {
        fontSize: 18,
        marginBottom: 5,
        color: '#1a73e8',
    },
    meta: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
        color: '#666',
        fontSize: 8,
    },
    image: {
        width: '100%',
        height: 120,
        objectFit: 'cover',
        marginBottom: 10,
    },
    section: {
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 12,
        marginBottom: 5,
        color: '#1a73e8',
    },
    ingredientsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
        marginBottom: 10,
    },
    ingredientCard: {
        width: '23%',
        padding: 5,
        backgroundColor: '#f8f9fa',
        borderRadius: 3,
        alignItems: 'center',
    },
    ingredientImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginBottom: 3,
    },
    ingredient: {
        fontSize: 6,
        marginBottom: 2,
    },
    instruction: {
        fontSize: 8,
        marginBottom: 5,
        flexDirection: 'row',
        gap: 5,
    },
    stepNumber: {
        color: '#1a73e8',
        fontWeight: 'bold',
    },
    instructionImage: {
        width: '30%',
        height: 60,
        objectFit: 'cover',
        marginLeft: 5,
        borderRadius: 3,
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
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ flex: 1 }}>{step.instruction.replace(/<[^>]*>/g, '')}</Text>
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