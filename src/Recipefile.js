import { useParams, useNavigate } from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import axios from 'axios';

const Recipefile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
  
    useEffect(() => {
      const savetoken = localStorage.getItem("token");
      axios.get(`http://localhost:5001/savedrecipes/${id}`,{
        headers: {
          Authorization: `Bearer ${savetoken}`,
        },
      })
        .then(res => setRecipe(res.data))
        .catch(err => console.log("Failed to load saved recipe or recipe does not exist. Please try again later", err));
    }, [id]);
  
    if (!recipe){
      return (
        <div>
          <button onClick={() => navigate("/recipes")}>← Back to Saved Recipes</button>;
          <p style={{ color: "red" }}>Failed to load saved recipe or recipe does not exist. Please try again later.</p>
        </div>
      )
    }
  
    return (
      <div>
        <button onClick={() => navigate("/recipes")}>← Back to Saved Recipes</button>
        <h3>{recipe.name}</h3>
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
