import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../App";
import api from '../api';

// Sample data for fallback
const sampleProfile = {
  name: "Raju",
  username: "bro123",
  email: "bro96864@gmail.com",
  verified: true,
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  stats: {
    emailsSent: 1532,
    subscribers: 256,
    daily: [10, 20, 15, 30, 25, 40, 35],
    weekly: [100, 120, 110, 130, 125, 140, 135],
  },
  personal: {
    fullName: "Raju",
    dob: "May 15, 1985",
    gender: "Male",
    phone: "+1 234 567 8901",
    address: "3621 Connecticut Ave NW, Washington, DC 200008, USA",
  },
};

const TABS = ["Personal Info", "Security", "Notifications", "Activity/Usage"];

const Profile = () => {
  const [tab, setTab] = useState("Personal Info");
  const [showApiKey, setShowApiKey] = useState(false);
  const [currentApiKey, setCurrentApiKey] = useState("");
  const [newApiKey, setNewApiKey] = useState("");
  const [message, setMessage] = useState("");
  const [loadingApiKey, setLoadingApiKey] = useState(true);
  const [profileData, setProfileData] = useState(sampleProfile);
  const [isSampleData, setIsSampleData] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editProfile, setEditProfile] = useState({ ...sampleProfile.personal });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || sampleProfile.username;

  // Fetch user profile data from backend
  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (!loadingProfile && profileData.personal) {
      setEditProfile({ ...profileData.personal });
      setAvatarPreview(profileData.avatar);
    }
  }, [loadingProfile]);

  const fetchUserProfile = async () => {
    setLoadingProfile(true);
    try {
      // Try to fetch from backend endpoint (if it exists)
      const response = await api.get('/api/auth/profile');
      if (response.data) {
        setProfileData({
          name: response.data.name || response.data.username || username,
          username: response.data.username || username,
          email: response.data.email || "",
          verified: response.data.verified || false,
          avatar: response.data.avatar || sampleProfile.avatar,
          stats: response.data.stats || sampleProfile.stats,
          personal: response.data.personal || sampleProfile.personal,
        });
        setIsSampleData(false);
      }
    } catch (error) {
      console.log("Profile endpoint not available, using sample data");
      // Keep sample data and mark as sample
      setIsSampleData(true);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (tab === "Security") fetchCurrentApiKey();
    // eslint-disable-next-line
  }, [tab]);

  const fetchCurrentApiKey = async () => {
    setLoadingApiKey(true);
    try {
      const res = await api.get('/api/auth/app-password', { params: { username } });
      setCurrentApiKey(res.data.appPassword);
    } catch (err) {
      setCurrentApiKey("");
    }
    setLoadingApiKey(false);
  };

  const handleUpdateApiKey = async (e) => {
    e.preventDefault();
    if (!newApiKey.trim()) {
      setMessage("Please enter a new API key");
      return;
    }
    try {
      const res = await api.post('/api/auth/update-app-password', {
        username,
        appPassword: newApiKey,
      });
      setMessage(res.data);
      setNewApiKey("");
      fetchCurrentApiKey();
    } catch (err) {
      setMessage(err.response?.data || "Failed to update API key.");
    }
  };

  const handleSignout = () => {
    logout();
    navigate("/login");
  };

  const handleEditChange = (e) => {
    setEditProfile({ ...editProfile, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/auth/profile', editProfile);
      if (avatarFile) {
        const formData = new FormData();
        formData.append('file', avatarFile);
        await api.post('/api/auth/profile/avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      setEditMode(false);
      await fetchUserProfile();
      setAvatarFile(null);
    } catch (err) {
      alert('Failed to update profile.');
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-[#f6f8fa] py-6 px-2 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fa] py-6 px-2 flex flex-col items-center">
      {/* Sample Data Indicator */}
      {isSampleData && (
        <div className="w-full max-w-2xl mb-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
            <span className="text-yellow-800 text-sm font-medium">
              📋 Sample Data - Backend profile endpoint not available
            </span>
          </div>
        </div>
      )}

      {/* Profile Header */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow p-4 sm:p-8 flex flex-col sm:flex-row items-center gap-6 mb-6">
        <div className="relative">
          <img src={avatarPreview || profileData.avatar} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-blue-100" />
          {editMode && (
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="absolute left-0 top-0 w-24 h-24 opacity-0 cursor-pointer" title="Upload avatar" />
          )}
        </div>
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-2xl font-bold">{profileData.name}</h2>
              <div className="text-gray-500 text-sm">{profileData.username}</div>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                {profileData.email}
                {profileData.verified && <span className="text-green-600 text-lg">✔️</span>}
                <span className="text-green-600 text-xs">Verified</span>
              </div>
            </div>
            {!editMode && (
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setEditMode(true)}>
                Edit Profile
            </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow p-4 flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
        <div className="flex-1 flex flex-col items-center">
          <div className="text-gray-500 text-xs mb-1">Emails Sent</div>
          <div className="text-2xl font-bold">{profileData.stats.emailsSent.toLocaleString()}</div>
          <div className="w-20 h-6 mt-1"><svg width="80" height="24"><polyline fill="none" stroke="#3b82f6" strokeWidth="2" points="0,20 10,18 20,15 30,10 40,12 50,8 60,5 70,7 80,4" /></svg></div>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <div className="text-gray-500 text-xs mb-1">Subscribers</div>
          <div className="text-2xl font-bold">{profileData.stats.subscribers.toLocaleString()}</div>
          <div className="w-20 h-6 mt-1"><svg width="80" height="24"><polyline fill="none" stroke="#3b82f6" strokeWidth="2" points="0,20 10,15 20,12 30,14 40,10 50,8 60,12 70,10 80,7" /></svg></div>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <div className="flex gap-2 text-xs text-gray-500 mb-1">
            <span className={"font-semibold " + (tab === "Daily" ? "text-blue-600" : "")}>Daily</span>
            <span className="text-gray-300">|</span>
            <span className={"font-semibold " + (tab === "Weekly" ? "text-blue-600" : "")}>Weekly</span>
          </div>
          <div className="w-20 h-6 mt-1"><svg width="80" height="24"><polyline fill="none" stroke="#3b82f6" strokeWidth="2" points="0,20 10,18 20,15 30,10 40,12 50,8 60,5 70,7 80,4" /></svg></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full max-w-2xl flex border-b border-gray-200 mb-4 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            className={`py-2 px-4 font-medium border-b-2 transition whitespace-nowrap ${tab === t ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-blue-600"}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow p-4 mb-6">
        {tab === "Personal Info" && (
          <div>
            <h3 className="text-lg font-bold mb-4">Personal Info</h3>
            {editMode ? (
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                  <div>
                    <label className="text-xs text-gray-500">Full Name</label>
                    <input name="fullName" value={editProfile.fullName || ''} onChange={handleEditChange} className="w-full border p-2 rounded" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Date of Birth</label>
                    <input name="dob" value={editProfile.dob || ''} onChange={handleEditChange} className="w-full border p-2 rounded" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Gender</label>
                    <input name="gender" value={editProfile.gender || ''} onChange={handleEditChange} className="w-full border p-2 rounded" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Phone</label>
                    <input name="phone" value={editProfile.phone || ''} onChange={handleEditChange} className="w-full border p-2 rounded" />
                  </div>
                </div>
                <div className="mt-2">
                  <label className="text-xs text-gray-500">Address</label>
                  <input name="address" value={editProfile.address || ''} onChange={handleEditChange} className="w-full border p-2 rounded" />
                </div>
                <div className="flex gap-4 mt-4">
                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save</button>
                  <button type="button" className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400" onClick={() => setEditMode(false)}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                  <div>
                    <div className="text-xs text-gray-500">Full Name</div>
                    <div className="font-semibold">{profileData.personal.fullName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Date of Birth</div>
                    <div className="font-semibold">{profileData.personal.dob}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Gender</div>
                    <div className="font-semibold">{profileData.personal.gender}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Phone</div>
                    <div className="font-semibold">{profileData.personal.phone}</div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-xs text-gray-500">Address</div>
                  <div className="font-semibold">{profileData.personal.address}</div>
                </div>
              </>
            )}
          </div>
        )}
        {tab === "Security" && (
          <div>
            <h3 className="text-lg font-bold mb-4">API Key Management</h3>
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Current API Key:</span>
                {loadingApiKey ? (
                  <span className="text-gray-400 text-xs">Loading...</span>
                ) : (
                  <span className="text-gray-700 font-mono text-xs">
                    {showApiKey ? currentApiKey : "••••••••••••••••"}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="text-blue-600 text-xs hover:underline"
                >
                  {showApiKey ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <form onSubmit={handleUpdateApiKey} className="space-y-4">
              <label className="block font-semibold">Update API Key</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full border p-2 rounded pr-12 font-mono"
                  placeholder="New API Key"
                  value={newApiKey}
                  onChange={(e) => setNewApiKey(e.target.value)}
                  required
                />
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Update API Key
        </button>
      {message && (
                <div className={`mb-4 p-3 rounded ${message.includes("successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message}
        </div>
      )}
            </form>
          </div>
        )}
        {tab === "Notifications" && (
          <div className="text-gray-500">Notification preferences coming soon...</div>
        )}
        {tab === "Activity/Usage" && (
          <div className="text-gray-500">Activity and usage stats coming soon...</div>
        )}
      </div>
      
      <div className="w-full max-w-2xl border-t pt-4">
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