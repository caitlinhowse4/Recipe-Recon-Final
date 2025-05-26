import React, {useEffect, useState} from 'react';
import axios from 'axios';

const SavedRecipes = () => {
    const [recipesSaved, setRecipesSaved] = useState([]);
    const [nameRecipe, setRecipeName] = useState('');
    const [searchRecipe, setSearchRecipe] = useState('');

    useEffect(() => {
        axios.get('/recipes')
            .then(res => setRecipesSaved(res.data))
            .catch(err => console.log(err));
    })
    const saveRecipe = async (recipe) => {
        if (!nameRecipe) return alert("Please specify a name");
        axios.post('/recipes', {name: nameRecipe})
            .then(res => setRecipesSaved([...nameRecipe, res.data]))
            .catch(err => console.log(err));
        setRecipeName('');
    };
    const recipeSearch = searchRecipe ? recipesSaved.filter(recipe => recipe.name.toLowerCase().includes(searchRecipe.toLowerCase()))
    : recipesSaved;
    return (
        <div>
            <input
                type="text"
                value={nameRecipe}//unsure if I want to do it this way or based on the api
                onChange={(e) => setRecipeName(e.target.value)}
                placeholder="Name Recipe"
                required
            />
            <input
                type="text"
                value={searchRecipe}
                onChange={(e) => setSearchRecipe(e.target.value)}
            />
            <button type="submit">Search Recipe</button>
            <ul>
                {recipeSearch.map((recipesSaved, index) => (
                    <li key={index}>{recipesSaved.name}</li>//Show all suggestions
                ))}
            </ul>
        </div>
    );
}
export default SavedRecipes;