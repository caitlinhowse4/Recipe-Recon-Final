import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const SavedRecipes = () => {
    const [recipesSaved, setRecipesSaved] = useState([]);
    const [searchRecipe, setSearchRecipe] = useState('');
    const [selectedRecipe, setSelectRecipe] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        axios.get('/savedrecipes')
            .then(res => setRecipesSaved(res.data))
            .catch(err => console.log(err));
    }, [])
    return (
        <div>
            <input
                type="text"
                value={searchRecipe}
                onChange={(e) => setSearchRecipe(e.target.value)}
                placeholder="Search recipe"
            />
            <button type="submit">Search Recipe</button>
            <ul>
                {recipesSaved.map((recipes, index) => (
                    <li key={index} onClick={() =>navigate('/savedrecipes/${recipes._id}')}>
                        <button>{recipes.name}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default SavedRecipes;