import Login from "./Login/Login";
import Signup from "./Login/Signup";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Footer from "./Components/Common/Footer";
import SubscribersPage from "./Components/SubscribersPage";
import EmailSenderForm from "./EmailSender/EmailSenderForm";
import TemplateSelector from "./EmailSender/TemplateSelector";
import Profile from "./Login/Profile";
import Home from "./Components/Common/Home";
import Navbar from "./Components/Common/Navbar";
import LiveTemplateView from "./Components/LiveTemplateView";
import EmailTemplates from "./Components/EmailTemplates";
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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    // You can log error info here if needed
    // console.error(error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          <h2 className="font-bold text-lg mb-2">Something went wrong</h2>
          <div>{this.state.error?.toString()}</div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AboutHome() {
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow text-center">
      <h1 className="text-4xl font-bold mb-4 text-orange-600">Welcome to Email Services Application</h1>
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
          <ErrorBoundary>
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/about" element={<AboutHome />} />
              <Route path="/login" element={<Login saveToken={saveToken} />} />
              <Route path="/signup" element={<Signup />} />

              {/* Show Hero at root if not logged in, else show dashboard */}
              <Route
                path="/"
                element={<Navigate to="/home" replace />}
              />
              <Route
                path="/sendemails"
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
                    <EmailTemplates />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/templates/live/:templateName"
                element={
                  <ProtectedRoute>
                    <LiveTemplateView />
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
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
