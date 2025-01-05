/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        ui: ['ui-sans-serif', '"Segoe UI"', 'Roboto', 'Arial', 'sans-serif']
      },
      colors: {
        'primary': '#1DA1F2',
        'secondary': '#14171A',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

