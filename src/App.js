import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecipeForm from './RecipeForm'; // rename from TodoForm
import './styles/App.css';


const App = () => {
  const [adjustedIngredients, setAdjustedIngredients] = useState([]);

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
      <RecipeForm onCalculate={handleCalculation} />
      <h2>Adjusted Ingredients:</h2>
      <ul>
        {adjustedIngredients.map((item, index) => (
          <li key={index}>
            {item.name}: {item.adjustedQuantity} {item.unit}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
