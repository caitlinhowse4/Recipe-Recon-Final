import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecipeForm from './RecipeForm';
import SuggestionForum from './SuggestionForum';
import './styles/App.css';

const App = () => {
  const [mode, setMode] = useState('browse');
  const [search, setSearch] = useState('chicken');
  const [recipes, setRecipes] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [adjustedIngredients, setAdjustedIngredients] = useState([]);
  const [originalServings, setOriginalServings] = useState(4);
  const [desiredServings, setDesiredServings] = useState(4);

  useEffect(() => {
    if (mode === 'browse') {
      const fetchRecipes = async () => {
        try {
          const response = await axios.get(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`
          );
          setRecipes(response.data.meals || []);
        } catch (err) {
          console.error("Error fetching recipes:", err);
        }
      };
      fetchRecipes();
    }
  }, [search, mode]);

  const extractIngredients = (recipe) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const name = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      if (name && name.trim()) {
        const [qty, ...unitParts] = (measure || '').trim().split(' ');
        ingredients.push({
          name,
          quantity: qty || '1',
          unit: unitParts.join(' ') || '',
        });
      }
    }
    return ingredients;
  };

  const handleRecipeClick = (recipe) => {
    const ingredients = extractIngredients(recipe);
    setSelectedIngredients(ingredients);
    setOriginalServings(4);
    setDesiredServings(4);
    setAdjustedIngredients([]);
  };

  const handleCalculation = ({ ingredients, originalServings, desiredServings }) => {
    const factor = desiredServings / originalServings;
    const recalculated = ingredients.map((ingredient) => ({
      name: ingredient.name,
      adjustedQuantity: (parseFloat(ingredient.quantity) * factor).toFixed(2),
      unit: ingredient.unit,
    }));
    setAdjustedIngredients(recalculated);
  };

  return (
    <div className="container">
      <h1>Recipe Recalculator App</h1>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setMode('browse')}>Browse Recipes</button>
        <button onClick={() => setMode('custom')}>Create Your Own</button>
        <button onClick={() => setMode('suggest')}>Add A Suggestion</button>
      </div>

      {mode === 'browse' && (
        <>
          <input
            type="text"
            placeholder="Search recipes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: '10px', marginBottom: '20px' }}
          />
          <div className="gallery">
            {recipes.map((recipe, index) => (
              <div key={index} className="card" onClick={() => handleRecipeClick(recipe)}>
                <img src={recipe.strMealThumb} alt={recipe.strMeal} style={{ width: '100%' }} />
                <h4>{recipe.strMeal}</h4>
                <p>{recipe.strArea} | {recipe.strCategory}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {(mode === 'custom' || selectedIngredients.length > 0) && (
        <>
          <RecipeForm
            ingredients={mode === 'custom' ? undefined : selectedIngredients}
            onCalculate={handleCalculation}
            originalServings={originalServings}
            desiredServings={desiredServings}
            setOriginalServings={setOriginalServings}
            setDesiredServings={setDesiredServings}
          />

          <h2>Adjusted Ingredients:</h2>
          <ul>
            {adjustedIngredients.map((item, index) => (
              <li key={index}>
                {item.name}: {item.adjustedQuantity} {item.unit}
              </li>
            ))}
          </ul>
        </>
      )}

      {(mode === 'suggest' &&
          <>
            <h3>Suggestion Forum</h3>
            <SuggestionForum />
          </>
      )}
    </div>
  );
};

export default App;
