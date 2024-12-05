import { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import RecipePDF from './RecipePDF';
import './RecipeDisplay.css';
import { CORS_PROXY_URL } from '../config';

function RecipeDisplay({ recipe }) {
    const [images, setImages] = useState({
        main: null,
        ingredients: {},
        instructions: {}
    });

    useEffect(() => {
        // Reset images when recipe changes
        setImages({
            main: null,
            ingredients: {},
            instructions: {}
        });

        const fetchImages = async () => {
            try {
                console.log("fetchimages");
                const blobToBase64 = (blob) => {
                    return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(blob);
                    });
                };

                // Fetch main recipe image
                const imageUrl = recipe.media.images[2].image;
                const response = await fetch(CORS_PROXY_URL + imageUrl);
                const blob = await response.blob();
                const mainImageData = await blobToBase64(blob);

                // Fetch ingredient images
                const ingredientPromises = recipe.ingredients.map(async (ingredient) => {
                    if (ingredient.media?.images?.[0]?.image) {
                        const response = await fetch(CORS_PROXY_URL + ingredient.media.images[0].image);
                        const blob = await response.blob();
                        const base64 = await blobToBase64(blob);
                        return [ingredient.uid, base64];
                    }
                    return null;
                });

                // Fetch instruction images
                const instructionPromises = recipe.cooking_instructions.map(async (instruction) => {
                    if (instruction.media?.images?.[0]?.image) {
                        const response = await fetch(CORS_PROXY_URL + instruction.media.images[0].image);
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

                // Update images state
                setImages({
                    main: mainImageData,
                    ingredients: ingredientImagesMap,
                    instructions: instructionImagesMap
                });
                console.log("setimages");

            } catch (error) {
                console.error('Error loading images:', error);
            }
        };

        fetchImages();
    }, [recipe]);

    return (
        <div className="recipe">
            <p className="recipe-title">Current Recipe: <strong>{recipe.title}</strong></p>
            <div className="recipe-actions">
                <PDFDownloadLink
                    key={recipe.title}
                    document={<RecipePDF recipe={recipe} images={images} />}
                    fileName={`${recipe.title}.pdf`}
                    className="download-button"
                >
                    {({ loading }) => (
                        <button
                            className="download-button"
                            disabled={loading || !images.main}
                        >
                            {!loading && images.main ? 'Download PDF' : "Loading images..."}
                        </button>
                    )}
                </PDFDownloadLink>
            </div>
        </div>
    );
}

export default RecipeDisplay;