import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const parseInstructions = (htmlString) => {
    // Split by paragraph tags and clean up
    return htmlString
        .split('</p>')
        .map(p => p.replace(/<p>/g, '').replace(/<\/?strong>/g, '').trim())
        .filter(p => p.length > 0);
};

const styles = StyleSheet.create({
    // Layout
    page: {
        padding: 15,
        fontFamily: 'Helvetica',
    },
    contentContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
    },
    leftColumn: {
        width: '35%',
    },
    rightColumn: {
        width: '55%',
    },
    section: {
        marginBottom: 10,
    },

    // Typography
    title: {
        fontSize: 18,
        marginBottom: 5,
        color: '#d32f2f',
    },
    sectionTitle: {
        fontSize: 12,
        marginBottom: 5,
        color: '#d32f2f',
    },
    meta: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
        color: '#666',
        fontSize: 8,
    },

    // Images
    image: {
        width: '100%',
        height: 180,
        objectFit: 'cover',
        marginBottom: 10,
        borderRadius: 5,
    },
    ingredientImage: {
        width: 15,
        height: 15,
        borderRadius: 8,
    },
    instructionImage: {
        width: 80,
        height: 64,
        objectFit: 'cover',
        borderRadius: 3,
    },
    instructionImageContainer: {
        width: 80,
        minWidth: 80,
        height: 64,
    },

    // Ingredients
    ingredientsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
    },
    ingredientCard: {
        width: '31%',
        padding: 3,
        backgroundColor: '#f8f9fa',
        borderRadius: 3,
        marginBottom: 3,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    ingredient: {
        fontSize: 8,
        flex: 1,
    },

    // Instructions
    instruction: {
        fontSize: 8,
        marginBottom: 10,
    },
    instructionContent: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'flex-start',
    },
    instructionTextContainer: {
        flex: 1,
        paddingLeft: 90,
    },
    instructionTextContainerWithImage: {
        flex: 1,
        paddingLeft: 0,
    },
    instructionText: {
        marginBottom: 3,
    },
});

function RecipePDF({ recipe, images }) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>{recipe.title}</Text>

                <View style={styles.meta}>
                    <Text>Time: {recipe.prep_times.for_2} mins</Text>
                    <Text>Rating: {recipe.rating.average}/5</Text>
                </View>

                <View style={styles.contentContainer}>
                    <View style={styles.leftColumn}>
                        {images.main && (
                            <Image
                                style={styles.image}
                                src={images.main}
                            />
                        )}
                    </View>

                    <View style={styles.rightColumn}>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Ingredients</Text>
                            <View style={styles.ingredientsGrid}>
                                {recipe.ingredients.map((ingredient) => (
                                    <View key={ingredient.uid} style={styles.ingredientCard}>
                                        {images.ingredients[ingredient.uid] && (
                                            <Image
                                                style={styles.ingredientImage}
                                                src={images.ingredients[ingredient.uid]}
                                            />
                                        )}
                                        <Text style={styles.ingredient}>{ingredient.label}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Instructions</Text>
                    {recipe.cooking_instructions.map((step) => (
                        <View key={step.order} style={styles.instruction}>
                            <View style={styles.instructionContent}>
                                {images.instructions[step.order] ? (
                                    <>
                                        <View style={styles.instructionImageContainer}>
                                            <Image
                                                style={styles.instructionImage}
                                                src={images.instructions[step.order]}
                                            />
                                        </View>
                                        <View style={styles.instructionTextContainerWithImage}>
                                            {parseInstructions(step.instruction).map((line, index) => (
                                                <Text key={index} style={styles.instructionText}>
                                                    {line}
                                                </Text>
                                            ))}
                                        </View>
                                    </>
                                ) : (
                                    <View style={styles.instructionTextContainer}>
                                        {parseInstructions(step.instruction).map((line, index) => (
                                            <Text key={index} style={styles.instructionText}>
                                                {line}
                                            </Text>
                                        ))}
                                    </View>
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