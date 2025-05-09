import React, { useState } from 'react';
import axios from 'axios';

const AuthForm = ({ onAuth }) => {
  const [formType, setFormType] = useState('login');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleFormType = () => {
    setFormType(formType === 'login' ? 'register' : 'login');
    setFormData({ username: '', email: '', password: '' });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `http://localhost:5000/api/auth/${formType}`;
    try {
      const res = await axios.post(url, formData);
      const token = res.data.token;
      if (token) {
        localStorage.setItem('token', token);
        onAuth(res.data.user); // notify App component
      } else {
        alert(res.data.msg || 'Success');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Error occurred');
    }
  };

  const handleGuest = () => {
    localStorage.setItem('token', 'guest-token');
    window.location.href = '/dashboard'; // Or the appropriate route
  };

  return (
    <div className="auth-form">
      <h2>{formType === 'login' ? 'Login' : 'Register'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {formType === 'register' && (
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">{formType === 'login' ? 'Login' : 'Register'}</button>
      </form>

      <p>
        {formType === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button onClick={toggleFormType}>
          {formType === 'login' ? 'Register' : 'Login'}
        </button>
      </p>

      <button
        type="button"
        onClick={handleGuest}
        style={{
          marginTop: '1rem',
          backgroundColor: '#ccc',
          color: '#000',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Continue as Guest
      </button>
    </div>
  );
};

export default AuthForm;

