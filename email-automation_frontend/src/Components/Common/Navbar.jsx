import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { isLoggedIn, logout } from "../../App";

const Navbar = () => {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const navLinks = (
    <>
      <NavLink
        to="/home"
        className={({ isActive }) =>
          isActive ? "underline" : "hover:underline"
        }
        onClick={() => setMenuOpen(false)}
      >
        Home
      </NavLink>
      {loggedIn ? (
        <>
          <NavLink to="/sendemails" className={({ isActive }) => isActive ? "underline" : "hover:underline"} onClick={() => setMenuOpen(false)}>Send Emails</NavLink>
          <NavLink to="/templates" className={({ isActive }) => isActive ? "underline" : "hover:underline"} onClick={() => setMenuOpen(false)}>Templates</NavLink>
          <NavLink to="/subscribers" className={({ isActive }) => isActive ? "underline" : "hover:underline"} onClick={() => setMenuOpen(false)}>Subscribers</NavLink>
          <NavLink to="/profile" className={({ isActive }) => isActive ? "underline" : "hover:underline"} onClick={() => setMenuOpen(false)}>Profile</NavLink>
          
        </>
      ) : (
        <>
          <NavLink to="/login" className={({ isActive }) => isActive ? "underline" : "hover:underline"} onClick={() => setMenuOpen(false)}>Login</NavLink>
          <NavLink to="/signup" className={({ isActive }) => isActive ? "underline" : "hover:underline"} onClick={() => setMenuOpen(false)}>Signup</NavLink>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-[#0e2239] text-white px-4 py-3 flex items-center justify-between relative shadow">
      {/* Hamburger for mobile - now on the left */}
      <button
        className="sm:hidden focus:outline-none z-20 mr-2"
        aria-label="Toggle menu"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          {menuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          )}
        </svg>
      </button>
      <div className="flex items-center gap-2">
        <span className="text-xl sm:text-2xl md:text-3xl">✉️</span>
        <span className="font-bold text-lg sm:text-2xl md:text-2xl leading-tight">My Smart Mailer</span>
      </div>
      {/* Desktop links */}
      <div className="hidden sm:flex space-x-6 text-lg font-semibold">{navLinks}</div>
      {/* Mobile menu - slide from left with overlay */}
      {menuOpen && (
        <>
          {/* Overlay - now fully transparent */}
          <div
            className="fixed inset-0 bg-transparent z-30 transition-opacity duration-300"
            onClick={() => setMenuOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed top-0 left-0 h-full w-64 bg-[#0e2239] z-40 shadow-lg flex flex-col p-6 animate-slide-in-left transition-transform duration-300">
            <button
              className="self-end mb-6 text-white text-2xl focus:outline-none"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              &times;
            </button>
            <nav className="flex flex-col gap-6 text-lg font-semibold">{navLinks}</nav>
          </div>
          <style>{`
            @keyframes slide-in-left {
              from { transform: translateX(-100%); }
              to { transform: translateX(0); }
            }
            .animate-slide-in-left {
              animation: slide-in-left 0.3s cubic-bezier(0.4,0,0.2,1);
            }
          `}</style>
        </>
      )}
    </nav>
  );
};

export default Navbar;
