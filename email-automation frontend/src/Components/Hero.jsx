import React from 'react';

export default function Hero() {
  return (
    <div className="bg-[#0e2239] min-h-screen text-white font-sans">
      

      {/* Hero */}
      <div className="bg-white text-[#0e2239] px-10 py-20 flex flex-col md:flex-row items-center justify-between">
        <div className="max-w-xl mb-10 md:mb-0">
          <h1 className="text-4xl font-bold mb-4">Email Automation</h1>
          <p className="text-lg mb-6">
            Automate your emails with different types of templates
          </p>
          <button className="bg-yellow-400 px-6 py-2 rounded font-semibold text-black hover:bg-yellow-500">
            Get Started
          </button>
        </div>
        <img
          src="https://cdn-icons-png.flaticon.com/512/561/561127.png"
          alt="Email Illustration"
          className="w-56 md:w-80"
        />
      </div>
    </div>
  );
}
