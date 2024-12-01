import { PDFDownloadLink } from '@react-pdf/renderer';
import RecipePDF from './RecipePDF';
import './RecipeDisplay.css';

function RecipeDisplay({ recipe }) {
    return (
        <div className="recipe">
            <div className="recipe-actions">
                <PDFDownloadLink
                    document={<RecipePDF recipe={recipe} />}
                    fileName={`${recipe.title}.pdf`}
                    className="download-button"
                >
                    {({ blob, url, loading, error }) =>
                        loading ? 'Generating PDF...' : 'Download PDF'
                    }
                </PDFDownloadLink>
            </div>
        </div>
    );
}

export default RecipeDisplay; 