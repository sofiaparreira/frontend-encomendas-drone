import React from 'react'

const ButtonDefault = ({ text, onClick, type = "button", variant = "primary", disabled = false }) => {
    const baseClasses = "px-4 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed w-full cursor-pointer";

    const variants = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
        secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500",
        danger: "bg-red-50 border border-red-200 text-red-600 focus:ring-red-500",
        success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
        outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variants[variant]}`}
        >
            {text}
        </button>
    );
};

export default ButtonDefault;