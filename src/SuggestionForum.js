import React, { useEffect, useState } from "react";
import axios from "axios";
// This component allows users to submit suggestions and view a list of all suggestions
const SuggestionForum = () => {
    const [suggestion, setSuggestion] = useState("");
    const [suggestionList, setSuggestionList] = useState([]);
    const [error, setError] = useState("");
// Fetch suggestions from the server when the component mounts
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
    // Handle suggestion submission
    const handleSuggest = async(e) => {
        e.preventDefault();
        const newSuggestion = suggestion.trim();
        if(!newSuggestion){
            setError("Please write a suggestion");
            return;
        }
        setSuggestion('');
        try{
            const response = await axios.post("http://localhost:5001/suggestion",{
                 suggestion: newSuggestion,
            });
            
            setSuggestionList((prev) => [...prev, response.data]);
            setSuggestion('');
            setError('');
        } catch(err){
            setError(err.response?.data?.error || "Failed to submit suggestion");
        }
    };
// Render the suggestion form and the list of suggestions
    return(
        <div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSuggest}>
                <input
                type="text"
                placeholder="Write a Suggestion"
                value={suggestion}
                onChange={(e)=>setSuggestion(e.target.value)}
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
