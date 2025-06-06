import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./styles/Login.css"; // adjust path if needed

// This component handles user login and guest access
const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
// Handle the login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/login", {
        username,
        password,
      });
// Save the token in localStorage
      const { token } = response.data;
      localStorage.setItem("token", token);
      onLoginSuccess();
      navigate("/recipes");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };
//guest access
  const handleGuestAccess = () => {
    localStorage.setItem("guest", "true");
    onLoginSuccess();
    navigate("/recipes");
  };
// Render the login form with input fields for username and password
  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
  
      <p className="link">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
  
      <button onClick={handleGuestAccess} className="guest-button">
        Continue as Guest
      </button>
    </div>
  );
  
};

export default Login;
