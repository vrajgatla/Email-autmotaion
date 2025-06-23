import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { isLoggedIn, logout } from "../App";

const Navbar = () => {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();

  const handleSignout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-orange-500 text-white px-6 py-4 flex justify-between items-center">
      <div className="text-2xl font-bold">📧 Email Service</div>
      <div className="space-x-6 text-lg font-semibold">
        {loggedIn ? (
          <>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "underline" : "hover:underline"
              }
            >
              Send Email
            </NavLink>
            <NavLink
              to="/subscribers"
              className={({ isActive }) =>
                isActive ? "underline" : "hover:underline"
              }
            >
              Subscribers
            </NavLink>
            <NavLink
              to="/templates"
              className={({ isActive }) =>
                isActive ? "underline" : "hover:underline"
              }
            >
              Templates
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? "underline" : "hover:underline"
              }
            >
              Profile
            </NavLink>
            <button
              onClick={handleSignout}
              className="hover:underline cursor-pointer text-red-200"
            >
              Signout
            </button>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "underline" : "hover:underline"
              }
            >
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className={({ isActive }) =>
                isActive ? "underline" : "hover:underline"
              }
            >
              Signup
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
