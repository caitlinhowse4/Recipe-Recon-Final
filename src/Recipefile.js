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
  const [urlImage, setUrlImage] = useState(null);

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

  useEffect(() => {
    const getCover = async () => {
      if(recipe && recipe.cover) {
        const savetoken = localStorage.getItem("token");
        try{
          const response = await axios.get(`http://localhost:5001/user-image/${recipe._id}`, {
            headers: {
              Authorization: `Bearer ${savetoken}`,
            },
            responseType: "blob"
          });
          const url = URL.createObjectURL(response.data);
          setUrlImage(url);
        } catch (error){
          setUrlImage(null);
        }
      }
    };
    getCover();
  }, [recipe]);

  // If recipe is not found, display an error message
  if (!recipe) {
    return (
      <div>
        <button onClick={() => navigate("/recipes")}>← Back to Saved Recipes</button>
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
      const savetoken = localStorage.getItem("token");
      formData.append('cover', recipeCover);
      try{
        await axios.post(`http://localhost:5001/savedrecipes/${recipe._id}/cover`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${savetoken}`
        }
      });
      setError("");
      window.location.reload();
      } catch(error){
        setError("Failed to upload cover.");
      }
    };


  // Render the recipe name and its ingredients
  const handleDelete = async () => {
  const confirmDelete = window.confirm("Are you sure you want to delete this recipe?");
  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:5001/savedrecipes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    alert("Recipe deleted successfully.");
    navigate("/recipes"); // Redirect to recipe list
  } catch (err) {
    console.error("Error deleting recipe:", err);
    alert("Failed to delete the recipe.");
  }
};
 
  return (

    <div>
      <button onClick={() => navigate("/recipes")}>← Back to Saved Recipes</button>
      <button onClick={handleDelete}>Delete Recipe</button>
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
      accept="image/*"
      onChange={handleCoverChange}
      />
      <button onClick={handleCoverUpload}>Upload Recipe Cover</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "20px 0"}}>
        {urlImage && (<img src={urlImage} alt={recipe.name} style={{ maxWidth: "300px"}}/>)}  
      </div>
      
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
