// src/pages/Signup.jsx
import React, { useState } from "react";
import api from '../api';
import { useNavigate } from "react-router-dom";
import BackButton from '../Components/Common/BackButton';

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const res = await api.post('/api/auth/signup', {
        username: email,
        email,
        password,
        name,
      });
      setMessage(res.data);
      setError("");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage("");
      let errorMessage = "Signup failed. Try a different email.";
      if (err.response && err.response.data && err.response.data.error) {
        errorMessage = err.response.data.error;
      } else if (err.response && typeof err.response.data === 'string') {
        errorMessage = err.response.data;
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#f8f9fa] px-2 py-8">
      <div className="w-full max-w-2xl flex justify-start mb-2"><BackButton /></div>
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-left">Sign Up</h2>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        {message && <p className="mb-4 text-blue-600 text-sm">{message}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-black text-white py-2 rounded-md font-semibold text-base hover:bg-gray-900 transition">Sign up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
