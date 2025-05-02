import React, { useState } from 'react';
import axios from 'axios';

const RecipeForm = ({ onCalculate }) => {
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: '' }]);
  const [originalServings, setOriginalServings] = useState('');
  const [desiredServings, setDesiredServings] = useState('');

  const handleIngredientChange = (index, e) => {
    const newIngredients = [...ingredients];
    newIngredients[index][e.target.name] = e.target.value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '' }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      ingredients,
      originalServings: parseFloat(originalServings),
      desiredServings: parseFloat(desiredServings),
    };

    onCalculate(data); // send data to App.js
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Original Servings:</label>
        <input
          type="number"
          value={originalServings}
          onChange={(e) => setOriginalServings(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Desired Servings:</label>
        <input
          type="number"
          value={desiredServings}
          onChange={(e) => setDesiredServings(e.target.value)}
          required
        />
      </div>

      <h3>Ingredients</h3>
      {ingredients.map((ingredient, index) => (
        <div key={index}>
          <input
            type="text"
            name="name"
            placeholder="Ingredient"
            value={ingredient.name}
            onChange={(e) => handleIngredientChange(index, e)}
            required
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={ingredient.quantity}
            onChange={(e) => handleIngredientChange(index, e)}
            required
          />
          <select
            name="unit"
            value={ingredient.unit || ''}
            onChange={(e) => handleIngredientChange(index, e)}
            required
          >
            <option value="">Unit</option>
            <option value="g">g</option>
            <option value="kg">kg</option>
            <option value="ml">ml</option>
            <option value="l">l</option>
            <option value="tsp">tsp</option>
            <option value="tbsp">tbsp</option>
            <option value="cup">cup</option>
            <option value="pcs">pcs</option>
          </select>
        </div>
      ))}
      <button type="button" onClick={addIngredient}>Add Ingredient</button>
      <button type="submit">Recalculate</button>
    </form>
  );
};

export default RecipeForm;
