// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from "react-router-dom";
import axios from "axios";
import Register from "./Register";
import Login from "./Login";
import RecipeForm from "./RecipeForm";
import "./styles/App.css";
import "./styles/DishcoveryModel.css";
import SuggestionForum from "./SuggestionForum";
import SavedRecipes from "./SavedRecipes";
import Recipefile from "./Recipefile";
import DeleteAccount from "./DeleteAccount";


// Main App component that manages the application state and routing
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
  const [showDishcovery, setShowDishcovery] = useState(false);
  const [error, setError] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');


  // Function to handle successful login
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setIsGuest(false);
  };
  // Function to handle user logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("guest");
    setIsAuthenticated(false);
    setIsGuest(false);
    window.location.href = "/login";
  };
  // Function to handle guest login
  const handleGuestLogin = () => {
    setIsGuest(true);
    setIsAuthenticated(true);
  };
  // Effect to fetch recipes when the component mounts or when search changes
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
  // Effect to fetch saved recipes when the component mounts
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
            unit = parts.slice(1).join(" ") || "unit"; // if no unit, default to pcs
          } else {
            // if not a number, assume full measure is unit
            quantity = "1";
            unit = measure;
          }
        }
        // Push the ingredient object to the array
        ingredients.push({
          name,
          quantity,
          unit: unit || "pcs", // default unit if still blank
        });
      }
    }

    return ingredients;
  };

  // Effect to fetch saved recipes when the component mounts
  const handleRecipeClick = (recipe) => {
    const ingredients = extractIngredients(recipe);
    setSelectedIngredients(ingredients);
    setOriginalServings(4);
    setDesiredServings(4);
    setAdjustedIngredients([]);
    setMode("custom"); // ✅ switch view to the custom mode so form shows up

  };
  // Effect to fetch saved recipes when the component mounts
  const handleCalculation = ({ ingredients, originalServings, desiredServings }) => {
    const factor = desiredServings / originalServings;
    const recalculated = ingredients.map((ingredient) => ({
      name: ingredient.name,
      adjustedQuantity: (parseFloat(ingredient.quantity) * factor).toFixed(2),
      unit: ingredient.unit,
    }));
    setAdjustedIngredients(recalculated);
  };
  // Effect to fetch saved recipes when the component mounts
  const saveRecipe = async () => {
    if (!nameRecipe.trim() || adjustedIngredients.length === 0) {
      setError("Please recalculate the ingredients and name your recipe before saving.");
      return;
    }

    try {
      const savetoken = localStorage.getItem("token");
      await axios.post('http://localhost:5001/savedrecipes', {
        name: nameRecipe,
        ingredients: adjustedIngredients,
        tags, // 
      }, {
        headers: {
          Authorization: `Bearer ${savetoken}`,
        },
      });
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
            <button onClick={() => setMode("browse")}>Browse Recipes</button>&nbsp;
            <button onClick={() => setMode("custom")}>Create Your Own</button>&nbsp;
            <button onClick={() => setMode("save")}>Saved Recipes</button>&nbsp;
            <button onClick={() => setMode("suggest")}>Suggestion Forum</button>&nbsp;
            <button onClick={handleLogout}>Logout</button>&nbsp;
            <Link to="/delete-account" >
      Delete My Account
    </Link>
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
          <Route path="/delete-account" element={<DeleteAccount />} />
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


                  {mode === "custom" && (
  <>
    <RecipeForm
      ingredients={selectedIngredients.length > 0 ? selectedIngredients : undefined}
      onCalculate={handleCalculation}
      originalServings={originalServings}
      desiredServings={desiredServings}
      setOriginalServings={setOriginalServings}
      setDesiredServings={setDesiredServings}
      tags={tags}
      setTags={setTags}
      newTag={newTag}
      setNewTag={setNewTag}
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
        <button
          onClick={() => setShowDishcovery(true)}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "#4CAF52",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            fontSize: "24px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            zIndex: 999,
          }}
        > 👋
        </button>

        {showDishcovery && (
          <div className="dishcovery-backdrop">
            <div className="dishcovery-modal">
              <button className="close-button" onClick={() => setShowDishcovery(false)}>✖</button>
              <iframe
                src="https://copilotstudio.microsoft.com/environments/Default-5e022ca1-5c04-4f87-8db7-d588726274e3/bots/cr932_dishcovery/webchat?__version__=2"
                frameBorder="0"
                title="Dishcovery AI"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
        )}
      </div>
    </Router>
  );
};


export default App;