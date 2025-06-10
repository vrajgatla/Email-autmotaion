import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SubscribersPage from "./Components/SubscribersPage";
import EmailSenderForm from "./EmailSender/EmailSenderForm";
import TemplateSelector from "./EmailSender/TemplateSelector";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<EmailSenderForm />} />
            <Route path="/subscribers" element={<SubscribersPage />} />
            <Route path="/templates" element={<TemplateSelector />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
