// src/components/ui/Button.jsx
import React from 'react';

export default function Button({ children, className = '', disabled = false, ...rest }) {
  const base = 'inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium';
  const enabled = 'bg-indigo-600 text-white hover:bg-indigo-700';
  const disabledCls = 'opacity-50 cursor-not-allowed';
  return (
    <button
      className={`${base} ${disabled ? disabledCls : enabled} ${className}`}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
