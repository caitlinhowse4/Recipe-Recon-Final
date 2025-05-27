import {useParams} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import axios from 'axios';

const RecipeFile = () => {
    const {id}= useParams();
    const [recipe, setRecipe] = useState('');

    useEffect(() => {
        axios.get(`/savedrecipes/${id}`)
            .then((res=>setRecipe(res.data)))
                .catch((err)=>console.log(err))

    }, [id]);
        if(!recipe) return <>Loading...</>;

return(
    <div>
       <h2>{recipe.name}</h2>
        <h2>Ingredients List:</h2>
        <ul>
            {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient.name}: {ingredient.adjustedQuantity} {ingredient.unit}</li>//Show all suggestions
            ))}
        </ul>
    </div>
)
}