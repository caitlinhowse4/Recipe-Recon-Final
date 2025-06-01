// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";
import Register from "./Register";
import Login from "./Login";
import RecipeForm from "./RecipeForm";
import "./styles/App.css";
import SuggestionForum from "./SuggestionForum";
import SavedRecipes from "./SavedRecipes";
import Recipefile from "./Recipefile";


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token") || !!localStorage.getItem("guest") === "true");
  const [isGuest, setIsGuest] = useState(!!localStorage.getItem("guest"));
  const [mode, setMode] = useState("browse");
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [adjustedIngredients, setAdjustedIngredients] = useState([]);
  const [originalServings, setOriginalServings] = useState(4);
  const [desiredServings, setDesiredServings] = useState(4);
  const [recipes, setRecipes] = useState([]);
  const [recipesSaved, setRecipesSaved] = useState([]);
  const [nameRecipe, setRecipeName] = useState('');
  const [search, setSearch] = useState(" ");
  const [error, setError] = useState("");



  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setIsGuest(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("guest");
    setIsAuthenticated(false);
    setIsGuest(false);
    window.location.href = "/login";
  };

  const handleGuestLogin = () => {
    setIsGuest(true);
    setIsAuthenticated(true);
  };

  useEffect(() => {
    if (mode === "browse" && isAuthenticated) {
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
  }, [search, mode, isAuthenticated]);

  const extractIngredients = (recipe) => {
    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
      const name = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];

      if (name && name.trim()) {
        let quantity = "1"; // default
        let unit = "";

        if (measure && measure.trim()) {
          const parts = measure.trim().split(" ");
          const parsedQty = parseFloat(parts[0]);

          // If the first part is a number, use it
          if (!isNaN(parsedQty)) {
            quantity = parsedQty.toString();
            unit = parts.slice(1).join(" ") || "pcs"; // if no unit, default to pcs
          } else {
            // if not a number, assume full measure is unit
            quantity = "1";
            unit = measure;
          }
        }

        ingredients.push({
          name,
          quantity,
          unit: unit || "pcs", // default unit if still blank
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

  const saveRecipe = async () => {
    if (!nameRecipe.trim() || adjustedIngredients.length === 0) {
      setError("Please recalculate the ingredients and name your recipe before saving.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post('http://localhost:5001/savedrecipes', {
        name: nameRecipe,
        ingredients: adjustedIngredients,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
      setError("Recipe saved!");
      setRecipeName('');
      setAdjustedIngredients([]);
    } catch (err) {
      console.error("Error saving recipe:", err.response?.data || err.message);
      setError("Failed to save recipe.");
    }
  };
  return (
    <Router>
      <div className="container">
        <h1>Recipe Recalculator App</h1>

        {isAuthenticated && (
          <div style={{ marginBottom: "20px" }}>
            <button onClick={() => setMode("browse")}>Browse Recipes</button>
            <button onClick={() => setMode("custom")}>Create Your Own</button>
            <button onClick={() => setMode("save")}>Saved Recipes</button>
            <button onClick={() => setMode("suggest")}>Suggestion Forum</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}


        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/recipes" /> : <Navigate to="/login" />}
          />
          <Route path="/savedrecipes/:id" element={<Recipefile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} onGuestLogin={handleGuestLogin} />} />
          <Route
            path="/recipes"
            element={
              isAuthenticated ? (
                <>
                  {mode === "browse" && (
                    <>
                      <div className="search-container">
                        <input
                          type="text"
                          placeholder="Search recipes"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                        <span className="search-icon">🔍</span>
                      </div>

                      <div className="gallery">
                        {recipes.map((recipe, index) => (
                          <div
                            key={index}
                            className="card"
                            onClick={() => handleRecipeClick(recipe)}
                          >
                            <img
                              src={recipe.strMealThumb}
                              alt={recipe.strMeal}
                              style={{ width: "100%" }}
                            />
                            <h4>{recipe.strMeal}</h4>
                            <p>
                              {recipe.strArea} | {recipe.strCategory}
                            </p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {mode === "save" && (
                    <>
                      <h3>Saved Recipes</h3>
                      <SavedRecipes />
                    </>
                  )}

                  {mode === "suggest" && (
                    <>
                      <h3>Suggestion Forum</h3>
                      <SuggestionForum />
                    </>
                  )}


                  {(mode === "custom" || selectedIngredients.length > 0) && (
                    <>
                      <RecipeForm
                        ingredients={mode === "custom" ? undefined : selectedIngredients}
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
                      {error && <p style={{ color: "red" }}>{error}</p>}
                      <input
                        type="text"
                        value={nameRecipe}
                        onChange={(e) => setRecipeName(e.target.value)}
                        placeholder="Name your recipe"
                        required
                      />
                      <button onClick={saveRecipe}>Save Recipe</button>

                    </>
                  )}
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
};


export default App;