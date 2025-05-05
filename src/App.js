import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SuggestionForum from './pages/SuggestionForum';
import './styles/App.css';


const App = () => {
       //uncomment all below if using database
       // const [suggestion, setSuggestion] = useState([]);
       // useEffect(() => {
       //     axios.get(`https://localhost:5000/suggestion`)
       //         .then(response => setSuggestion(response.data))
       //         .catch(error => console.error(error));
       //     },[]);
        return (
            <div className="container">
                <h1>Suggestion Forum</h1>
                <SuggestionForum/>
            </div>//if using database - <SuggestionForum suggestion={suggestion} setSuggestion={setSuggestion}/>
        );
};
export default App;

