// src/Register.js
import React, { useState } from "react";
import axios from "axios";
// This component handles user registration
const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
// Handle the registration form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/register", {
        username,
        password,
      });
      console.log(response.data);
      window.location.href = "/login";
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };
//  Render the registration form with input fields for username and password
  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
