import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import './App.css';
import RecipeDisplay from './components/RecipeDisplay';
import { CORS_PROXY_URL } from './config';

function App() {
  const [url, setUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [fuse, setFuse] = useState(null);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load recipe data using the base path
    const basePath = process.env.PUBLIC_URL || '';
    fetch(`${basePath}/data/recipe_urls.json`)
      .then(response => response.json())
      .then(data => {
        setFuse(new Fuse(data, {
          keys: ['name'],
          threshold: 0.3,
          distance: 100
        }));
      });
  }, []);

  useEffect(() => {
    if (fuse && searchTerm) {
      const results = fuse.search(searchTerm);
      setSearchResults(results.slice(0, 5)); // Show top 5 results
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, fuse]);

  const handleRecipeSelect = (selectedUrl) => {
    setUrl("https://www.gousto.co.uk/cookbook" + selectedUrl);
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Extract the recipe slug from the URL
      const slug = url.substring(url.lastIndexOf('/') + 1);
      if (!slug) throw new Error('Invalid URL format');

      // Use a CORS proxy service
      const apiUrl = `https://production-api.gousto.co.uk/cmsreadbroker/v1/recipe/${slug}`;
      const response = await fetch(CORS_PROXY_URL + apiUrl);

      const data = await response.json();
      if (data.status !== 'ok') throw new Error('Recipe not found');

      setRecipe(data.data.entry);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRandomRecipe = () => {
    if (fuse) {
      const allRecipes = fuse._docs; // Access the original list of recipes
      const randomRecipe = allRecipes[Math.floor(Math.random() * allRecipes.length)];
      setUrl("https://www.gousto.co.uk/cookbook" + randomRecipe.url);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="header">
          <h1>Gousto Recipe Card Generator</h1>
          <p>Enter a Gousto recipe URL, search by recipe name, or press the "Surprise Me!" button for a random recipe.</p>
        </div>

        <div className="search-container">
          <button onClick={handleRandomRecipe} className="random-button">
            Surprise Me!
          </button>

          <div className="url-separator">OR</div>

          <div className="search-box">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search recipes..."
              className="search-input"
            />
            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map(({ item }) => (
                  <div
                    key={item.url}
                    className="search-result-item"
                    onClick={() => handleRecipeSelect(item.url)}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="url-separator">OR</div>

          <form onSubmit={handleSubmit} className="url-form">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter Gousto recipe URL..."
              className="url-input"
            />
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Loading...' : 'Get Recipe'}
            </button>
          </form>
        </div>

        {error && <div className="error">{error}</div>}
        {recipe && <RecipeDisplay recipe={recipe} />}
      </div>
      <footer className="footer">
        <p>Built with ❤️ by <a href="https://github.com/VFJr" target="_blank" rel="noopener noreferrer">@VFJr</a></p>
      </footer>
    </div>
  );
}

export default App;
