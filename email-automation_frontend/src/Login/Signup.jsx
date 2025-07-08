// src/pages/Signup.jsx
import React, { useState } from "react";
import api from '../api';
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/signup', {
        username: email,
        email,
        password,
      });
      setMessage(res.data);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(err.response?.data || "Signup failed. Try a different email.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 sm:mt-10 bg-white p-4 sm:p-8 rounded shadow">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Sign Up</h2>
      {message && <p className="mb-4 text-blue-600">{message}</p>}
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
        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
