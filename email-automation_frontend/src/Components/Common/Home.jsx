import React from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../../App';
import BackButton from './BackButton';

export default function Home() {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  return (
    <div className="bg-[#eaf3fb] min-h-screen text-[#0e2239] font-sans">
      <div className="pt-4 pl-2"><BackButton /></div>
      {/* Hero Section */}
      <div className="px-4 sm:px-6 py-10 sm:py-16 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="max-w-xl mb-10 md:mb-0 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 leading-tight">My Smart Mailer<br />Send Smarter. Communicate Better.</h1>
          <p className="text-base sm:text-lg mb-8 text-gray-700">
            My Smart Mailer is dedicated to revolutionizing the way individuals and businesses communicate through email. We create innovative tools and features that make email more efficient, intuitive, and useful.
          </p>
          {!loggedIn ? (
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 rounded font-semibold text-base sm:text-lg shadow w-full sm:w-auto"
              onClick={() => navigate('/login')}
            >
              Continue with Login
            </button>
          ) : (
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-3 rounded font-semibold text-base sm:text-lg shadow w-full sm:w-auto"
              onClick={() => navigate('/sendemails')}
            >
              Send Email
            </button>
          )}
        </div>
        <div className="flex-shrink-0 flex justify-center w-full md:w-auto">
          <svg width="180" height="140" viewBox="0 0 220 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 h-32 sm:w-56 sm:h-44 md:w-[220px] md:h-[180px]">
            <ellipse cx="170" cy="90" rx="50" ry="70" fill="#ff884d"/>
            <rect x="20" y="40" width="120" height="80" rx="16" fill="#fff" stroke="#0e2239" strokeWidth="4"/>
            <polyline points="20,40 80,100 140,40" fill="none" stroke="#0e2239" strokeWidth="4"/>
            <polyline points="80,100 110,70 140,100" fill="none" stroke="#0e2239" strokeWidth="4"/>
            <polygon points="140,40 180,20 160,60" fill="#fff" stroke="#0e2239" strokeWidth="3"/>
          </svg>
        </div>
      </div>

      {/* Features Section (3 columns) */}
      <div className="bg-white py-8 sm:py-12 px-2 sm:px-4 border-t border-b border-[#eaf3fb]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 text-center">
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-2">Simplify Your Email Workflow</h3>
            <p className="text-gray-600 text-sm sm:text-base">Streamline email management in your organization</p>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-2">Powerful and Smart Features</h3>
            <p className="text-gray-600 text-sm sm:text-base">Intelligent solutions designed to enhance user experience</p>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-2">Streamline Communication</h3>
            <p className="text-gray-600 text-sm sm:text-base">Foster seamless and efficient communication</p>
          </div>
        </div>
      </div>

      {/* Detailed Features Grid (4 features) */}
      <section className="py-8 sm:py-12 px-2 sm:px-4 bg-[#eaf3fb]">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0e2239] mb-8 text-center">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-5xl mx-auto">
          <div className="flex flex-col items-center mb-6 md:mb-0">
            <span className="text-3xl sm:text-4xl mb-2">📧</span>
            <h3 className="font-semibold text-base sm:text-lg mb-1">Dynamic Templates</h3>
            <p className="text-gray-600 text-xs sm:text-sm text-center">Send beautiful, personalized emails using ready-made or custom templates.</p>
          </div>
          <div className="flex flex-col items-center mb-6 md:mb-0">
            <span className="text-3xl sm:text-4xl mb-2">📋</span>
            <h3 className="font-semibold text-base sm:text-lg mb-1">CSV Import</h3>
            <p className="text-gray-600 text-xs sm:text-sm text-center">Easily import your subscribers from CSV files for bulk campaigns.</p>
          </div>
          <div className="flex flex-col items-center mb-6 md:mb-0">
            <span className="text-3xl sm:text-4xl mb-2">🔒</span>
            <h3 className="font-semibold text-base sm:text-lg mb-1">Secure & Private</h3>
            <p className="text-gray-600 text-xs sm:text-sm text-center">Your data is protected. Use your own email provider or API key.</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-4xl mb-2">⚡</span>
            <h3 className="font-semibold text-base sm:text-lg mb-1">Fast & Reliable</h3>
            <p className="text-gray-600 text-xs sm:text-sm text-center">Send thousands of emails quickly with robust delivery tracking.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-8 sm:py-12 px-2 sm:px-4 bg-white border-t border-[#eaf3fb]">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0e2239] mb-8 text-center">How It Works</h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 sm:gap-8 max-w-5xl mx-auto">
          <div className="flex flex-col items-center mb-6 md:mb-0">
            <div className="bg-[#eaf3fb] border-2 border-[#ff884d] rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-xl sm:text-2xl font-bold mb-2">1</div>
            <span className="font-semibold text-sm sm:text-base">Sign Up</span>
            <p className="text-gray-500 text-xs sm:text-sm text-center">Create your free account in seconds.</p>
          </div>
          <div className="hidden md:block text-2xl sm:text-3xl text-[#ff884d]">→</div>
          <div className="flex flex-col items-center mb-6 md:mb-0">
            <div className="bg-[#eaf3fb] border-2 border-[#ff884d] rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-xl sm:text-2xl font-bold mb-2">2</div>
            <span className="font-semibold text-sm sm:text-base">Add Subscribers</span>
            <p className="text-gray-500 text-xs sm:text-sm text-center">Import or add your email list easily.</p>
          </div>
          <div className="hidden md:block text-2xl sm:text-3xl text-[#ff884d]">→</div>
          <div className="flex flex-col items-center">
            <div className="bg-[#eaf3fb] border-2 border-[#ff884d] rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-xl sm:text-2xl font-bold mb-2">3</div>
            <a href="/sendemails" className="font-semibold text-sm sm:text-base">Send Emails</a>
            <p className="text-gray-500 text-xs sm:text-sm text-center">Choose a template and launch your campaign!</p>
          </div>
        </div>
      </section>
    </div>
  );
} 