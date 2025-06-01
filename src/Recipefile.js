import { useParams, useNavigate } from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import axios from 'axios';

const Recipefile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [recipeCover, setRecipeCover] = useState(null);
    const [error, setError] = useState("");
  
    useEffect(() => {
      axios.get(`http://localhost:5001/savedrecipes/${id}`)
        .then(res => setRecipe(res.data))
        .catch(err => console.log(err));
    }, [id]);
  
    if (!recipe) return <>Loading...</>;

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
  
    return (
      <div>
        <button onClick={() => navigate("/recipes")}>Back to Saved Recipes</button>
        <h3>{recipe.name}</h3>
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
