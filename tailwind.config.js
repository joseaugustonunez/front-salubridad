/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        helveticaBold: ['Helvetica-Bold', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

