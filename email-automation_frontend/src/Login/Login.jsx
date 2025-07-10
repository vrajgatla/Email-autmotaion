// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from '../api';
import BackButton from '../Components/Common/BackButton';

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
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#f8f9fa] px-2 py-8">
      <div className="w-full max-w-2xl flex justify-start mb-2"><BackButton /></div>
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 sm:p-8 flex flex-col">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-left">Login</h2>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
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
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold text-base hover:bg-blue-700 transition">Log in</button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline font-medium">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
