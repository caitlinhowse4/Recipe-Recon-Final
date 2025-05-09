import React, { useState, useEffect } from 'react';

const RecipeForm = ({
  ingredients,
  onCalculate,
  originalServings,
  desiredServings,
  setOriginalServings,
  setDesiredServings,
}) => {
  const [localIngredients, setLocalIngredients] = useState([
    { name: '', quantity: '', unit: '' },
  ]);

  // If ingredients are passed in (from selected recipe), use them
  useEffect(() => {
    if (ingredients) {
      setLocalIngredients(ingredients);
    }
  }, [ingredients]);

  const handleIngredientChange = (index, e) => {
    const updated = [...localIngredients];
    updated[index][e.target.name] = e.target.value;
    setLocalIngredients(updated);
  };

  const addIngredient = () => {
    setLocalIngredients([...localIngredients, { name: '', quantity: '', unit: '' }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate({
      ingredients: localIngredients,
      originalServings: parseFloat(originalServings),
      desiredServings: parseFloat(desiredServings),
    });
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
      {localIngredients.map((ingredient, index) => (
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
      {!ingredients && (
        <button type="button" onClick={addIngredient}>
          Add Ingredient
        </button>
      )}
      <button type="submit">Recalculate</button>
    </form>
  );
};

export default RecipeForm;
