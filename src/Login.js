import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/login", {
        username,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("token", token);
      onLoginSuccess();
      navigate("/recipes");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };
//guest registration
  const handleGuestAccess = () => {
    localStorage.setItem("guest", "true");
    onLoginSuccess();
    navigate("/recipes");
  };

  return (
    <div>
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

      <p>Don't have an account? <Link to="/register">Register here</Link></p>

      <button
        onClick={handleGuestAccess}
        style={{ marginTop: "10px", backgroundColor: "#ccc", padding: "8px 16px", border: "none", borderRadius: "5px" }}
      >
        Continue as Guest
      </button>

    </div>
  );
};

export default Login;
