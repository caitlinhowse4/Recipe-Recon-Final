// src/SavedRecipes.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// This component displays a list of saved recipes and allows users to search for a specific recipe
const SavedRecipes = () => {
  const [recipesSaved, setRecipesSaved] = useState([]);
  const [searchRecipe, setSearchRecipe] = useState('');
  const navigate = useNavigate();
  // Fetch saved recipes from the server when the component mounts
  useEffect(() => {
    const savetoken = localStorage.getItem("token");
    axios.get('http://localhost:5001/savedrecipes', {
      headers: {
        Authorization: `Bearer ${savetoken}`,
      },})
         .then(res => setRecipesSaved(res.data))
         .catch(err => console.error("Error fetching saved recipes:", err));
        }, []);
      //  Filter the saved recipes based on the search input
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