/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}', './lib/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 18px 60px rgba(20, 184, 166, 0.18)'
      }
    }
  },
  plugins: []
};
