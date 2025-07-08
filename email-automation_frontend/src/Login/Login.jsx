// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../api';

const Login = ({ saveToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      // Uncomment and add debug logs in the login handler
      // Example:
      // console.log("Attempting login with email:", email);
      const res = await api.post('/api/auth/login', {
        username: email,
        password,
      });
      
      // Uncomment and add debug logs in the login handler
      // After successful login:
      // console.log("Login response:", res.data);
      // console.log("Token saved to localStorage:", localStorage.getItem('auth_token'));
      
      if (res.data.token && res.data.username && res.data.email) {
        saveToken(res.data.token);
        localStorage.setItem("username", res.data.username);
        localStorage.setItem("email", res.data.email);
        navigate("/");
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      // Uncomment and add debug logs in the login handler
      // console.error("Login error:", err);
      let errorMessage = "Login failed. Please check your credentials and try again.";
      if (err.response && err.response.status === 401) {
        errorMessage = "Invalid username or password.";
      } else if (err.message === "Network Error") {
        errorMessage = "Cannot connect to server. Please try again later.";
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 sm:mt-10 bg-white p-4 sm:p-8 rounded shadow">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Login</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          className="w-full border p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full border p-2 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
