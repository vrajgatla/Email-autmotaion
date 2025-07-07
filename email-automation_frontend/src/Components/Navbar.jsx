import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { isLoggedIn, logout } from "../App";

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
          <NavLink to="/" className={({ isActive }) => isActive ? "underline" : "hover:underline"} onClick={() => setMenuOpen(false)}>Send Email</NavLink>
          <NavLink to="/subscribers" className={({ isActive }) => isActive ? "underline" : "hover:underline"} onClick={() => setMenuOpen(false)}>Subscribers</NavLink>
          <NavLink to="/templates" className={({ isActive }) => isActive ? "underline" : "hover:underline"} onClick={() => setMenuOpen(false)}>Templates</NavLink>
          <NavLink to="/profile" className={({ isActive }) => isActive ? "underline" : "hover:underline"} onClick={() => setMenuOpen(false)}>Profile</NavLink>
          <button onClick={handleSignout} className="hover:underline cursor-pointer text-red-200">Signout</button>
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
    <nav className="bg-orange-500 text-white px-4 py-3 flex items-center justify-between relative">
      <div className="text-2xl font-bold">📧 Email Service</div>
      {/* Hamburger for mobile */}
      <button
        className="sm:hidden focus:outline-none z-20"
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
      {/* Desktop links */}
      <div className="hidden sm:flex space-x-6 text-lg font-semibold">{navLinks}</div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-orange-500 flex flex-col items-center space-y-4 py-4 shadow-lg sm:hidden z-10 animate-fade-in">
          {navLinks}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
