const { green } = require('tailwindcss/colors')
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'purple': '#9F0086',
      'white': '#ffffff',
      'grey': '#9a9a9a'
    },
    extend: {
      colors: {
        red: colors.red,
        green: colors.green
      }
    },
  },
  plugins: [],
}
