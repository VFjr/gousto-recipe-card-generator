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
});

function RecipePDF({ recipe }) {
    const [imageData, setImageData] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const corsProxy = 'https://corsproxy.io/?';
                const imageUrl = recipe.media.images[2].image;
                const response = await fetch(corsProxy + encodeURIComponent(imageUrl));
                const blob = await response.blob();
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImageData(reader.result);
                };
                reader.readAsDataURL(blob);
            } catch (error) {
                console.error('Error loading image:', error);
            }
        };

        fetchImage();
    }, [recipe]);

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
                    <View style={styles.ingredientsList}>
                        {recipe.ingredients.map((ingredient) => (
                            <Text key={ingredient.uid} style={styles.ingredient}>
                                • {ingredient.label}
                            </Text>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Instructions</Text>
                    {recipe.cooking_instructions.map((step) => (
                        <View key={step.order} style={styles.instruction}>
                            <Text style={styles.stepNumber}>{step.order}.</Text>
                            <Text>{step.instruction.replace(/<[^>]*>/g, '')}</Text>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
}

export default RecipePDF; 