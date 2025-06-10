// src/DeleteAccount.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DeleteAccount = () => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete your account? This cannot be undone.");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:5001/deleteaccount", {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem("token");
      alert("Your account has been deleted.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Failed to delete account. Please try again later.");
    }
  };

  return (
    <div className="delete-account">
      <h2>Delete My Account</h2>
      <p>This will permanently remove your account and all saved recipes.</p>
      <button onClick={handleDelete} style={{ backgroundColor: "red", color: "white" }}>
        Delete My Account
      </button>
    </div>
  );
};

export default DeleteAccount;
