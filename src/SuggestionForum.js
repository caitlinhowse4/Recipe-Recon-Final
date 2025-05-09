import React, {useEffect, useState} from 'react';
import axios from 'axios';

const SuggestionForum = () => {
    const [suggestion, setSuggestion] = useState('');
    const [suggestionSaved, setSuggestionsSaved] = useState([]);

    useEffect(() => {
        const savedSuggestions = JSON.parse(localStorage.getItem('savedSuggestions')) || [];
        setSuggestionsSaved(savedSuggestions);
    },[]);
    
    const saveSuggest = async () => {
        const newSuggest = {name: suggestion};
        const newSuggestion = [...suggestionSaved, newSuggest];
        setSuggestionsSaved(newSuggestion);
        localStorage.setItem('savedSuggestions', JSON.stringify(newSuggestion));

    };
    return(
        <div>
            <label htmlFor="suggest">Suggestion:</label>
                <input
                    type="text"
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                />
            <button type="submit" onClick={saveSuggest}>Suggestion</button>

        </div>
    );
};

export default SuggestionForum;