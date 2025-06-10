import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-orange-500 text-white px-6 py-4 flex justify-between items-center">
      <div className="text-2xl font-bold">📧 Email Service</div>
      <div className="space-x-6 text-lg font-semibold">
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
      </div>
    </nav>
  );
};

export default Navbar;
