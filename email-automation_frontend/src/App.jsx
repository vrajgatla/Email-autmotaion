import Login from "./Login/Login";
import Signup from "./Login/Signup";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Footer from "./Components/Footer";
import SubscribersPage from "./Components/SubscribersPage";
import EmailSenderForm from "./EmailSender/EmailSenderForm";
import TemplateSelector from "./EmailSender/TemplateSelector";
import Profile from "./Login/Profile";
import Navbar from "./components/Navbar";

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
  // console.log("All localStorage items cleared");
};

const ProtectedRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/home" />;
};

function PublicHome() {
  return (
    <div className="bg-white rounded shadow overflow-hidden">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-100 to-orange-50 py-12 px-6 text-center">
        <h1 className="text-5xl font-extrabold text-orange-600 mb-4">Email Automation Service</h1>
        <p className="text-xl text-gray-700 mb-6 max-w-2xl mx-auto">
          Effortlessly manage, automate, and personalize your email campaigns.<br />
          <span className="text-orange-500 font-semibold">Fast. Secure. Powerful.</span>
        </p>
        <div className="flex justify-center gap-6 mb-4">
          <Link to="/login" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded font-semibold text-lg shadow">Sign In</Link>
          <Link to="/signup" className="bg-white border border-orange-500 hover:bg-orange-100 text-orange-700 px-8 py-3 rounded font-semibold text-lg shadow">Sign Up</Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 px-4 bg-white border-t border-b border-orange-100">
        <h2 className="text-2xl font-bold text-orange-600 mb-8 text-center">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center">
            <span className="text-4xl mb-2">📧</span>
            <h3 className="font-semibold text-lg mb-1">Dynamic Templates</h3>
            <p className="text-gray-600 text-sm text-center">Send beautiful, personalized emails using ready-made or custom templates.</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl mb-2">📋</span>
            <h3 className="font-semibold text-lg mb-1">CSV Import</h3>
            <p className="text-gray-600 text-sm text-center">Easily import your subscribers from CSV files for bulk campaigns.</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl mb-2">🔒</span>
            <h3 className="font-semibold text-lg mb-1">Secure & Private</h3>
            <p className="text-gray-600 text-sm text-center">Your data is protected. Use your own email provider or API key.</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl mb-2">⚡</span>
            <h3 className="font-semibold text-lg mb-1">Fast & Reliable</h3>
            <p className="text-gray-600 text-sm text-center">Send thousands of emails quickly with robust delivery tracking.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 px-4 bg-orange-50">
        <h2 className="text-2xl font-bold text-orange-600 mb-8 text-center">How It Works</h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="bg-white border-2 border-orange-300 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-2">1</div>
            <span className="font-semibold">Sign Up</span>
            <p className="text-gray-500 text-sm text-center">Create your free account in seconds.</p>
          </div>
          <div className="hidden md:block text-3xl text-orange-400">→</div>
          <div className="flex flex-col items-center">
            <div className="bg-white border-2 border-orange-300 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-2">2</div>
            <span className="font-semibold">Add Subscribers</span>
            <p className="text-gray-500 text-sm text-center">Import or add your email list easily.</p>
          </div>
          <div className="hidden md:block text-3xl text-orange-400">→</div>
          <div className="flex flex-col items-center">
            <div className="bg-white border-2 border-orange-300 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-2">3</div>
            <span className="font-semibold">Send Emails</span>
            <p className="text-gray-500 text-sm text-center">Choose a template and launch your campaign!</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function AboutHome() {
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow text-center">
      <h1 className="text-4xl font-bold mb-4 text-orange-600">Welcome to Email Automation Service</h1>
      <p className="text-lg text-gray-700 mb-6">
        Effortlessly manage, automate, and personalize your email campaigns.<br />
        <span className="font-semibold">Features:</span> <br />
        <span className="text-gray-600">
          • Send emails with attachments and dynamic templates<br />
          • Manage your own subscriber lists<br />
          • Import subscribers from CSV<br />
          • Use your own email provider or API key<br />
          • Secure, fast, and easy to use
        </span>
      </p>
      <div className="flex justify-center gap-6 mb-6">
        <Link to="/login" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-semibold">Sign In</Link>
        <Link to="/signup" className="bg-gray-200 hover:bg-gray-300 text-orange-700 px-6 py-2 rounded font-semibold">Sign Up</Link>
      </div>
      <div className="text-gray-500 text-sm">
        <span>Try it now and supercharge your email workflow!</span>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/home" element={<PublicHome />} />
            <Route path="/about" element={<AboutHome />} />
            <Route path="/login" element={<Login saveToken={saveToken} />} />
            <Route path="/signup" element={<Signup />} />

            {/* Show PublicHome at root if not logged in, else show dashboard */}
            <Route
              path="/"
              element={
                isLoggedIn() ? <EmailSenderForm /> : <PublicHome />
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
            {/* Redirect all other routes to / */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
