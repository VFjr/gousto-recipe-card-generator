import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import Html from 'react-pdf-html';


// Register the Roboto font
Font.register({
    family: 'Inter',
    fonts: [
        {
            src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.ttf',
            fontWeight: 100,
        },
        {
            src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyfMZhrib2Bg-4.ttf',
            fontWeight: 200,
        },
        {
            src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuOKfMZhrib2Bg-4.ttf',
            fontWeight: 300,
        },
        {
            src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf',
            fontWeight: 400,
        },
        {
            src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fMZhrib2Bg-4.ttf',
            fontWeight: 500,
        },
        {
            src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf',
            fontWeight: 600,
        },
        {
            src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf',
            fontWeight: 700,
        },
        {
            src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyYMZhrib2Bg-4.ttf',
            fontWeight: 800,
        },
        {
            src: 'http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuBWYMZhrib2Bg-4.ttf',
            fontWeight: 900,
        },
    ],
});

const styles = StyleSheet.create({
    // Layout
    page: {
        padding: 15,
        fontFamily: 'Inter',
        flexDirection: 'column',
        flex: 1,
    },
    contentContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
        flexShrink: 0,
    },
    leftColumn: {
        width: '35%',
    },
    rightColumn: {
        width: '55%',
    },
    section: {
        flex: 1,
        flexDirection: 'column',
    },
    instructionsContent: {
        flex: 1,
        flexDirection: 'row',
        gap: 10,
    },
    instructionColumn: {
        flex: 1,
        flexDirection: 'column',
    },

    // Typography
    title: {
        fontSize: 18,
        marginBottom: 10,
        color: '#d32f2f',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 12,
        marginBottom: 5,
        color: '#d32f2f',
        fontWeight: 'bold',
        borderBottomWidth: 2,
        borderBottomColor: '#d32f2f',
        borderBottomStyle: 'solid',
    },
    meta: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
        color: '#666',
        fontSize: 9,
    },

    // Images
    image: {
        width: '100%',
        height: 180,
        objectFit: 'cover',
        borderRadius: 5,
    },
    ingredientImage: {
        width: 20,
        height: 20,
        borderRadius: 8,
    },
    instructionImage: {
        position: 'absolute',
        left: -5,
        width: 60,
        height: 100,
        objectFit: 'cover',
        borderRadius: 3,
    },
    instructionImageContainer: {
        width: 50,
        minWidth: 50,
        height: 100,
        overflow: 'hidden',
        position: 'relative',
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
        fontSize: 9,
        flex: 1,
    },

    // Instructions
    instruction: {
        flex: 1,
        marginBottom: 5,
    },
    instructionContent: {
        flex: 1,
        flexDirection: 'row',
        gap: 5,
        alignItems: 'flex-start',
    },
    instructionTextContainer: {
        flex: 1,
        paddingLeft: 0,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    instructionText: {
        marginBottom: 3,
    },
});

const instructionHtmlStylesheet = {
    p: {
        margin: 2,
    },
    '.text-purple': {
        color: 'purple',
    },
    '.text-danger': {
        color: 'red',
    },
};


function adjustSpaceInHtmlTags(html) {
    // https://github.com/danomatic/react-pdf-html/issues/100
    // Use a regular expression to find <strong> or <span> tags with a leading space after them and move the space before the tag
    return html.replace(/(<(strong|span)>)\s+/g, ' $1');
}

function RecipePDF({ recipe, images }) {
    const midPoint = Math.ceil(recipe.cooking_instructions.length / 2);
    const leftColumnInstructions = recipe.cooking_instructions.slice(0, midPoint);
    const rightColumnInstructions = recipe.cooking_instructions.slice(midPoint);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>{recipe.title}</Text>

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
                        <Text style={styles.sectionTitle}>Ingredients</Text>
                        <View style={styles.ingredientsGrid}>
                            {recipe.ingredients
                                .filter(ingredient => {
                                    return !ingredient.label.trim().endsWith('x0') && !ingredient.label.trim().startsWith('0 ');
                                })
                                .map((ingredient) => (
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

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Instructions</Text>
                    <View style={styles.instructionsContent}>
                        <View style={styles.instructionColumn}>
                            {leftColumnInstructions.map((step) => {
                                const instructionImageSrc = images.instructions[step.order] || images.main;
                                return (
                                    <View key={step.order} style={styles.instruction}>
                                        <View style={styles.instructionContent}>
                                            <View style={styles.instructionImageContainer}>
                                                {instructionImageSrc ? (
                                                    <Image
                                                        style={styles.instructionImage}
                                                        src={instructionImageSrc}
                                                    />
                                                ) : (
                                                    <Text>No Image Available</Text>
                                                )}
                                            </View>
                                            <View style={styles.instructionTextContainer}>
                                                <Html
                                                    stylesheet={instructionHtmlStylesheet}
                                                    style={{ fontSize: 9 }}
                                                >
                                                    {adjustSpaceInHtmlTags(step.instruction)}
                                                </Html>
                                            </View>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>

                        <View style={styles.instructionColumn}>
                            {rightColumnInstructions.map((step) => {
                                const instructionImageSrc = images.instructions[step.order] || images.main;
                                return (
                                    <View key={step.order} style={styles.instruction}>
                                        <View style={styles.instructionContent}>
                                            <View style={styles.instructionImageContainer}>
                                                {instructionImageSrc ? (
                                                    <Image
                                                        style={styles.instructionImage}
                                                        src={instructionImageSrc}
                                                    />
                                                ) : (
                                                    <Text>No Image Available</Text>
                                                )}
                                            </View>
                                            <View style={styles.instructionTextContainer}>
                                                <Html
                                                    stylesheet={instructionHtmlStylesheet}
                                                    style={{ fontSize: 9 }}
                                                >
                                                    {adjustSpaceInHtmlTags(step.instruction)}
                                                </Html>
                                            </View>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
}

export default RecipePDF;