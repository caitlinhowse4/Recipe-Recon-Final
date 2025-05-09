import React, { useState } from 'react';
import axios from 'axios';

const SuggestionForum = () => {
    const [suggestion, setSuggestion] = useState([]);
    const handleSubmit = (e) => {
        e.preventDefault();
        const newSuggestion = e.target.suggestion.value.trim();
        if(newSuggestion){
            setSuggestion([...suggestion, newSuggestion]);
            e.target.suggestion.value = '';//empties text box after submission
        }
    };

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="suggestion">Suggestion:</label>
                <input type="text" name="suggestion"/>
                <button type="submit">Add Suggestion</button>
            </form>
            <ul>
                {suggestion.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>//Show all suggestions
                ))}
            </ul>
        </div>
    );
};

export default SuggestionForum;