// src/SavedRecipes.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// This component displays a list of saved recipes and allows users to search for a specific recipe
const SavedRecipes = () => {
  const [recipesSaved, setRecipesSaved] = useState([]);
  const [searchRecipe, setSearchRecipe] = useState('');
  const navigate = useNavigate();
  const [selectedTag, setSelectedTag] = useState(null);

  // Fetch saved recipes from the server when the component mounts
  useEffect(() => {
  const savetoken = localStorage.getItem("token");
  axios.get('http://localhost:5001/savedrecipes', {
  headers: {
    Authorization: `Bearer ${savetoken}`,
  },
})
  .then(res => {
    console.log("Fetched Recipes:", res.data); // update this 👇
    res.data.forEach(r => console.log(r.name, "→ tags:", r.tags));
    setRecipesSaved(res.data);
  })
    .catch(err => console.error("Error fetching saved recipes:", err));
}, []);


  //  Filter the saved recipes based on the search input
  const filteredRecipes = recipesSaved.filter(recipe => {
  const matchesSearch = recipe.name.toLowerCase().includes(searchRecipe.toLowerCase());
  const matchesTag = selectedTag
    ? (recipe.tags || []).some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
    : true;
  return matchesSearch && matchesTag;
});

const allTags = Array.from(new Set(
  recipesSaved.flatMap(r => r.tags || [])
));

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <span>Filter by tag:</span>
        <button onClick={() => setSelectedTag(null)}>All</button>
        {allTags.map(tag => (
  <button key={tag} onClick={() => setSelectedTag(tag)}>
    #{tag}
  </button>
))}

      </div>

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
            <p style={{ fontSize: "0.9em", color: "pink" }}>
  Tags:{" "}
  {Array.isArray(recipe.tags) ? recipe.tags.map((tag, i) => (
    <button
      key={i}
      onClick={(e) => {
        e.stopPropagation(); // ✅ prevent bubbling to parent
        e.preventDefault();
              console.log("Selected tag:", tag); // 👈 See if this runs
  // ✅ prevent navigation
        setSelectedTag(tag); // ✅ filter the list
      }}
      style={{
        backgroundColor: "#ffc0cb",
        borderRadius: "12px",
        padding: "4px 8px",
        marginRight: "5px",
        border: "none",
        cursor: "pointer",
        fontSize: "0.9em",
        color: "#333",
      }}
    >
      #{tag}
    </button>
  )): null}
</p>


          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedRecipes;