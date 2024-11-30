import { useState } from 'react';
import './App.css';
import RecipeDisplay from './components/RecipeDisplay';

function App() {
  const [url, setUrl] = useState('');
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Extract the recipe slug from the URL
      const slug = url.substring(url.lastIndexOf('/') + 1);
      if (!slug) throw new Error('Invalid URL format');

      // Use a CORS proxy service
      const corsProxy = 'https://corsproxy.io/';
      const apiUrl = `https://production-api.gousto.co.uk/cmsreadbroker/v1/recipe/${slug}`;
      const response = await fetch(corsProxy + '?' + encodeURIComponent(apiUrl));

      const data = await response.json();
      if (data.status !== 'ok') throw new Error('Recipe not found');

      setRecipe(data.data.entry);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="header">
          <h1>Gousto Recipe Card Generator</h1>
          <p>Enter a Gousto recipe URL to generate a PDF recipe card.</p>
        </div>

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

        {error && <div className="error">{error}</div>}
        {recipe && <RecipeDisplay recipe={recipe} />}
      </div>
    </div>
  );
}

export default App;
