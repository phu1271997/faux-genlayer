/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0a0d14',
          800: '#121824',
          700: '#1a2334',
          600: '#253248',
        },
        brand: {
          purple: '#8b5cf6',
          cyan: '#06b6d4',
          pink: '#ec4899',
        }
      }
    },
  },
  plugins: [],
}
