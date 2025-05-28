import React, { useEffect, useState } from "react";
import axios from "axios";
//const axios = require("axios");
const SuggestionForum = () => {
    const [suggestion, setSuggestion] = useState("");
    const [suggestionList, setSuggestionList] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadSuggestions = async () => {
            try {
                const response = await axios.get("http://localhost:5001/suggestions");
                setSuggestionList(response.data);
            } catch (err) {
                setError(err.response?.data?.error || "Failed to load suggestions");
            }
        }
        loadSuggestions();
    }, []);
    const handleSuggest = async(e) => {
        e.preventDefault();
        const newSuggestion = suggestion.trim();
        if(!newSuggestion){
            setError("Please write a suggestion");
            return;
        }
        try{
            const response = await axios.post("http://localhost:5001/suggestion",{
                 suggestion: newSuggestion,
            });
            //console.log(response.data);
            setSuggestionList((prev) => [...prev, response.data]);
            setSuggestion('');
            setError('');
        } catch(err){
            setError(err.response?.data?.error || "Failed to submit suggestion");
        }
    };

    return(
        <div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSuggest}>
                <input
                type="text"
                placeholder="Write a Suggestion"
                value={suggestion}
                onChange={(e)=>setSuggestion(e.target.value)}
                required
                />
                <button type="submit">Add a Suggestion</button>
            </form>
            <ul>
                {suggestionList.map((suggestion, index) => (
                    <li key={index}>{suggestion.text}</li>//Show all suggestions
                ))}
            </ul>
        </div>
    );
};

export default SuggestionForum;
