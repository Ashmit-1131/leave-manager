import React from 'react';

export default function Button({ children, type = 'button', className = '', onClick }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-white bg-brand-500 hover:bg-brand-700 focus:outline-none ${className}`}
    >
      {children}
    </button>
  );
}
