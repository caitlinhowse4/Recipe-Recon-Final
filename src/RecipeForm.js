import React, { useState, useEffect } from 'react';
import axios from 'axios';

//constructor for the RecipeForm component
const RecipeForm = ({
  ingredients,
  onCalculate,
  originalServings,
  desiredServings,
  setOriginalServings,
  setDesiredServings,
   tags,
  setTags,
  newTag,       // ✅ add
  setNewTag,    // ✅ add
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
  //handles change to any input field in the ingredients list
  const handleIngredientChange = (index, e) => {
    const updated = [...localIngredients];
    updated[index][e.target.name] = e.target.value;
    setLocalIngredients(updated);
  };

const token = localStorage.getItem("token");

  //adds a new ingredient to the ingredients list
  const addIngredient = () => {
    setLocalIngredients([...localIngredients, { name: '', quantity: '', unit: '' }]);
  };
  //handles the form submission, sanitizes the input, and calls the onCalculate function with the adjusted values
  const handleSubmit = (e) => {
    e.preventDefault();

    const sanitized = localIngredients.map(ing => ({
      name: ing.name || 'Unnamed',
      quantity: ing.quantity || '1',
  unit: ing.unit?.trim() || 'pcs', // ✅ Make sure it's a string
      
    }));

    onCalculate({
      ingredients: sanitized,
      originalServings: parseFloat(originalServings),
      desiredServings: parseFloat(desiredServings),
    });
  };
  const handleSaveRecipe = async (data) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post("http://localhost:5001/savedrecipe", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Recipe saved successfully!");
    } catch (err) {
      console.error("Failed to save recipe:", err);
    }
  };

  // Render the form with input fields for original and desired servings, quick convert buttons, and ingredient inputs
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
      <div>
        <label>Add Tag:</label>
        <input
  type="text"
  placeholder="Type a tag and press Enter"
  style={{
    padding: "6px",
    width: "250px",
    marginTop: "5px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  }}
  value={newTag}
  onChange={(e) => setNewTag(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()]);
      }
      setNewTag('');
    }
  }}
/>

        <div>
          {tags.map((tag, i) => (
            <span key={i} style={{ marginRight: "8px", color: "pink" }}>
              #{tag}
            </span>
          ))}
        </div>
      </div>
{tags.length > 0 && (
  <div style={{ marginTop: "8px" }}>
    <strong>Tags:</strong>{" "}
    {tags.map((tag, i) => (
      <span
        key={i}
        style={{
          backgroundColor: "#ffc0cb",
          borderRadius: "12px",
          padding: "4px 10px",
          marginRight: "8px",
          color: "#333",
          display: "inline-block",
        }}
      >
        #{tag}
      </span>
    ))}
  </div>
)}

      <div style={{ marginTop: "10px" }}>
        <p>Quick Convert:</p>
        <button type="button" onClick={() => onCalculate({
          ingredients: localIngredients,
          originalServings: parseFloat(originalServings),
          desiredServings: parseFloat(originalServings) / 2,
        })}>
          1/2
        </button>
        <button type="button" onClick={() => onCalculate({
          ingredients: localIngredients,
          originalServings: parseFloat(originalServings),
          desiredServings: parseFloat(originalServings) / 3,
        })}>
          1/3
        </button>
        <button type="button" onClick={() => onCalculate({
          ingredients: localIngredients,
          originalServings: parseFloat(originalServings),
          desiredServings: parseFloat(originalServings) / 4,
        })}>
          1/4
        </button>
        <button type="button" onClick={() => onCalculate({
          ingredients: localIngredients,
          originalServings: parseFloat(originalServings),
          desiredServings: parseFloat(originalServings) * 2,
        })}>
          Double
        </button>
        {/* <button
          type="button"
          onClick={() => {
            const sanitized = localIngredients.map(ing => ({
              name: ing.name || 'Unnamed',
              quantity: ing.quantity || '1',
              unit: ing.unit || 'pcs',
            }));

            handleSaveRecipe({
              ingredients: sanitized,
              originalServings: parseFloat(originalServings),
              desiredServings: parseFloat(desiredServings),
              tags,
            });
          }}
        >
          Save Recipe
        </button> */}

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
              required // ✅ add this

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
