import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { logout } from "../App";

const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const username = localStorage.getItem("username") || "";
  const email = localStorage.getItem("email") || "";
  const [currentAppPassword, setCurrentAppPassword] = useState("");
  const [newAppPassword, setNewAppPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentAppPassword();
  }, []);

  const fetchCurrentAppPassword = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/app-password?username=${username}`);
      setCurrentAppPassword(res.data.appPassword);
      setLoading(false);
    } catch (err) {
      // console.error("Failed to fetch app password:", err);
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!newAppPassword.trim()) {
      setMessage("Please enter a new app password");
      return;
    }
    
    try {
      const res = await axios.post(`${API_URL}/auth/update-app-password`, {
        username,
        appPassword: newAppPassword,
      });
      setMessage(res.data);
      setNewAppPassword("");
      // Refresh the current app password
      fetchCurrentAppPassword();
    } catch (err) {
      setMessage(err.response?.data || "Failed to update app password.");
    }
  };

  const handleSignout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-6 sm:mt-10 bg-white p-4 sm:p-8 rounded shadow">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Profile</h2>
      
      <div className="mb-6 space-y-3">
        <div className="flex justify-between">
          <strong>Username:</strong> 
          <span>{username}</span>
        </div>
        <div className="flex justify-between">
          <strong>Email:</strong> 
          <span>{email}</span>
        </div>
        <div className="flex justify-between items-center">
          <strong>Current App Password:</strong> 
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">
              {showCurrentPassword ? currentAppPassword : "********"}
            </span>
            <button
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="text-blue-600 text-sm hover:underline"
            >
              {showCurrentPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-4 mb-6">
        <label className="block font-semibold">Update App Password</label>
        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            className="w-full border p-2 rounded pr-12"
            placeholder="New App Password"
            value={newAppPassword}
            onChange={(e) => setNewAppPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
          >
            {showNewPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Update App Password
        </button>
      </form>
      
      {message && (
        <div className={`mb-4 p-3 rounded ${
          message.includes("successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {message}
        </div>
      )}
      
      <div className="border-t pt-4">
        <button 
          onClick={handleSignout}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile; 