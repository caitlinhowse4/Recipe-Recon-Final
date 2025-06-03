import { useParams, useNavigate } from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import axios from 'axios';

const Recipefile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
  
    useEffect(() => {
      axios.get(`http://localhost:5001/savedrecipes/${id}`)
        .then(res => setRecipe(res.data))
        .catch(err => console.log(err));
    }, [id]);
  
    if (!recipe) return <>Loading...</>;
  
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
