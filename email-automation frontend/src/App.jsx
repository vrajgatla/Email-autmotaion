import Login from "./Login/Login";
import Signup from "./Login/Signup";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SubscribersPage from "./components/SubscribersPage";
import EmailSenderForm from "./EmailSender/EmailSenderForm";
import TemplateSelector from "./EmailSender/TemplateSelector";
import Profile from "./Login/Profile";

const TOKEN_KEY = "auth_token";
const EXPIRY_KEY = "token_expiry";

export const saveToken = (token, expiryInMinutes = 60) => {
  const expiryTime = new Date().getTime() + expiryInMinutes * 60 * 1000;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EXPIRY_KEY, expiryTime.toString());
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const isLoggedIn = () => {
  const token = getToken();
  const expiry = localStorage.getItem(EXPIRY_KEY);
  if (!token || !expiry || new Date().getTime() > parseInt(expiry)) {
    logout();
    return false;
  }
  return true;
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRY_KEY);
  localStorage.removeItem("username");
  localStorage.removeItem("email");
  // Clear all localStorage to ensure no old data remains
  localStorage.clear();
  console.log("All localStorage items cleared");
};

const ProtectedRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/login" element={<Login saveToken={saveToken} />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <EmailSenderForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/subscribers"
              element={
                <ProtectedRoute>
                  <SubscribersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/templates"
              element={
                <ProtectedRoute>
                  <TemplateSelector />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
