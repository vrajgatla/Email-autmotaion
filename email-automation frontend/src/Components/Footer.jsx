import React from "react";

const Footer = () => {
  return (
    <footer className="bg-orange-500 text-white text-center py-4 mt-10">
      &copy; {new Date().getFullYear()} Your Company. All rights reserved.
    </footer>
  );
};

export default Footer;
