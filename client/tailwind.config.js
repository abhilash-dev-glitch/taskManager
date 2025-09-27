/** @type {import('tailwindcss').Config} */
// client/tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // The 'theme' object is mandatory, even if you don't extend it.
  theme: { 
    extend: {},
  },
  plugins: [],
}