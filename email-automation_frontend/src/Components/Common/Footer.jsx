import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#0e2239] text-white py-8 sm:py-10 mt-10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Project Info */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold mb-2">Email Services Application</h2>
          <p className="text-xs sm:text-sm text-gray-300">
            Our project is dedicated to revolutionizing the way individuals and businesses communicate through email. We create innovative tools and features that make email more efficient, intuitive and useful.
          </p>
        </div>
        {/* Quick Links */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold mb-2 mt-6 md:mt-0">Quick Links</h3>
          <ul className="space-y-1">
            <li><Link to="/home" className="hover:underline">Home</Link></li>
            <li><a href="#features" className="hover:underline">Features</a></li>
            <li><a href="#pricing" className="hover:underline">Pricing</a></li>
            <li><a href="#about" className="hover:underline">About</a></li>
          </ul>
        </div>
        {/* Connect */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold mb-2 mt-6 md:mt-0">Connect</h3>
          <ul className="space-y-1">
            <li><a href="mailto:info@emailservices.com" className="hover:underline">Email</a></li>
            <li><a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">Twitter</a></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-gray-400 text-xs mt-8">&copy; {new Date().getFullYear()} Email Services Application. All rights reserved.</div>
    </footer>
  );
};

export default Footer;
