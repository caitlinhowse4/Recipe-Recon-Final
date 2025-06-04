import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// This component displays a saved recipe and its ingredients
const Recipefile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [recipeCover, setRecipeCover] = useState(null);
  const [error, setError] = useState("");

  // Fetch the saved recipe by ID when the component mounts
  useEffect(() => {
    const savetoken = localStorage.getItem("token");
    axios.get(`http://localhost:5001/savedrecipes/${id}`, {
      headers: {
        Authorization: `Bearer ${savetoken}`,
      },
    })
      .then(res => setRecipe(res.data))
      .catch(err => console.log("Failed to load saved recipe or recipe does not exist. Please try again later", err));
  }, [id]);
  // If recipe is not found, display an error message
  if (!recipe) {
    return (
      <div>
        <button onClick={() => navigate("/recipes")}>← Back to Saved Recipes</button>;
        <p style={{ color: "red" }}>Failed to load saved recipe or recipe does not exist. Please try again later.</p>
      </div>
    )
  }

  const handleCoverChange = (e) => {
      setRecipeCover(e.target.files[0]);
    }

    const handleCoverUpload = async () => {
      if(!recipeCover){
        setError("Please select a cover image to upload.");
        return;
      }
      const formData = new FormData();
      formData.append('cover', recipeCover);
      await axios.post(`http://localhost:5001/savedrecipes/${id}/upload-cover`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    }


  // Render the recipe name and its ingredients
  return (

    <div>
      <button onClick={() => navigate("/recipes")}>← Back to Saved Recipes</button>
      <h3>{recipe.name}</h3>

      {recipe.tags && recipe.tags.length > 0 && (
        <div>
          <h3>Tags:</h3>
          <div>
            {recipe.tags.map((tag, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: "#ffc0cb",
                  borderRadius: "12px",
                  padding: "4px 10px",
                  marginRight: "8px",
                  display: "inline-block",
                  color: "#333",
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
      <input
            type="file"
            accept="cover/*"
            onChange={handleCoverChange}
          />
        <button onClick={handleCoverUpload}>Upload Recipe Cover</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {recipe.imagePath && (<img src={`http://localhost:5001/user-image/${recipe.id}`} alt={recipe.name}></img>)}  

      <h2>Ingredients List:</h2>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>
            {ingredient.name}: {ingredient.adjustedQuantity} {ingredient.unit}
          </li>
        ))}
      </ul>
    </div>

  );


};

export default Recipefile;
