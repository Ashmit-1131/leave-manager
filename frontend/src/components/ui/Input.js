// src/components/ui/Input.jsx
import React from 'react';

export default function Input({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  className = '',
  ...rest
}) {
  return (
    <div className={`mb-3 ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        {...rest}
      />
    </div>
  );
}
