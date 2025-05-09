import React, { useState } from 'react';
import AuthForm from './AuthForm';
import RecipeForm from './RecipeForm';
import './styles/App.css';

const App = () => {
  const [user, setUser] = useState(null);
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <div className="container">
      <h1>Recipe Recalculator App</h1>
      {!user ? (
        <AuthForm onAuth={setUser} />
      ) : (
        <>
          <p>Welcome, {user.username || user.email}!</p>
          <button onClick={handleLogout}>Logout</button>
          <RecipeForm onCalculate={handleCalculation} />
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
    </div>
  );
};

export default App;

