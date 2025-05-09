import React, {useEffect, useState} from 'react';
import axios from 'axios';
//import savedRecipes from "../client/src/SavedRecipes";

const SavedRecipes = () => {
    const [recipesSaved, setRecipesSaved] = useState([]);
    const [nameRecipe, setRecipeName] = useState('');
    const [searchRecipe, setSearchRecipe] = useState('');

    useEffect(() => {
        const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
        setRecipesSaved(savedRecipes);
    },[]);
    const saveRecipe = async (recipe) => {
        const newRecipe = {name: nameRecipe};
        const newSavedRecipes = [...recipesSaved, newRecipe];
        setRecipesSaved(newSavedRecipes);
        localStorage.setItem('savedRecipes', JSON.stringify(newSavedRecipes));

    };
    const recipeSearch = searchRecipe ? recipesSaved.filter(recipe => recipe.name.toLowerCase().includes(searchRecipe.toLowerCase()))
    : recipesSaved;
    return (
        <div>
            <input
                type="text"
                value={nameRecipe}
                onChange={e => setRecipeName(e.target.value)}
                placeholder="Name Recipe"
                required
            />
            <button type="submit" onClick={saveRecipe}>Save Recipe</button>
            <input
                type="text"
                value={searchRecipe}
                onChange={(e) => setSearchRecipe(e.target.value)}
                placeholder="Search Recipe"
                required
            />
            <button type="submit">Search Recipe</button>
            <ul>
                {recipeSearch.map((saved, index) => (
                    <li key={index}>{saved.name}</li>//Show all recipes
                ))}
            </ul>
        </div>
    );
}
export default SavedRecipes;