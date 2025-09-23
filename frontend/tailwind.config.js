// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1', // use this as bg-brand-500
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#2a2566',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // recommended for nicer form styles
  ],
};
