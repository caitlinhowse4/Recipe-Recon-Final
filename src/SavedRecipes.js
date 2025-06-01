// src/SavedRecipes.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SavedRecipes = () => {
  const [recipesSaved, setRecipesSaved] = useState([]);
  const [searchRecipe, setSearchRecipe] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    axios.get('http://localhost:5001/savedrecipes')
         .then(res => setRecipesSaved(res.data))
         .catch(err => console.error("Error fetching saved recipes:", err));
        }, []);
      
  const filteredRecipes = recipesSaved.filter(recipe =>
    recipe.name.toLowerCase().includes(searchRecipe.toLowerCase())
  );
  return (
        <div>
          <input
            type="text"
            value={searchRecipe}
            onChange={(e) => setSearchRecipe(e.target.value)}
            placeholder="Search recipe"
          />
          <button type="submit">Search Recipe</button>
          <ul>
            {filteredRecipes.map((recipe, index) => (
              <li key={index} onClick={() => navigate(`/savedrecipes/${recipe._id}`)}>
                <button>{recipe.name}</button>
              </li>
            ))}
          </ul>
        </div>
      );
    };

export default SavedRecipes;