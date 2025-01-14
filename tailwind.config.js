/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-', 
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Archivos dentro de src
    './public/index.html',       // Archivo HTML principal
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

