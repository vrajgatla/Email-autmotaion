import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ text = "Back", className = "" }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className={`flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium py-2 px-2 rounded transition ${className}`}
      aria-label="Go back"
    >
      <span className="text-xl">&#8592;</span>
      <span className="hidden sm:inline">{text}</span>
    </button>
  );
};

export default BackButton; 