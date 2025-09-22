import React from 'react';

export default function Input({ label, type = 'text', value, onChange, name, placeholder }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-brand-200"
      />
    </div>
  );
}
