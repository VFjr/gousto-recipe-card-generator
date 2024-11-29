import './RecipeDisplay.css';

function RecipeDisplay({ recipe }) {
    return (
        <div className="recipe">
            <header className="recipe-header">
                <h1>{recipe.title}</h1>
                <div className="recipe-meta">
                    <span>⏱️ {recipe.prep_times.for_2} mins</span>
                    <span>⭐ {recipe.rating.average}/5 ({recipe.rating.count} ratings)</span>
                </div>
                <p className="description">{recipe.description}</p>
            </header>

            <div className="recipe-image">
                <img src={recipe.media.images[2].image} alt={recipe.title} />
            </div>

            <section className="ingredients">
                <h2>Ingredients</h2>
                <div className="ingredients-grid">
                    {recipe.ingredients.map((ingredient) => (
                        <div key={ingredient.uid} className="ingredient-card">
                            <img src={ingredient.media.images[0].image} alt={ingredient.name} />
                            <p>{ingredient.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="instructions">
                <h2>Instructions</h2>
                {recipe.cooking_instructions.map((step) => (
                    <div key={step.order} className="instruction-step">
                        <div className="step-number">{step.order}</div>
                        <div className="step-content">
                            <div dangerouslySetInnerHTML={{ __html: step.instruction }} />
                            {step.media.images.length > 0 && (
                                <img src={step.media.images[0].image} alt={`Step ${step.order}`} />
                            )}
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}

export default RecipeDisplay; 