var colors = require('tailwindcss/colors')

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
  safelist: [{
    pattern: /(bg|text|border)-(Purple|Pink|Orange|Yellow|Lime|Mint|Test|Test2)/
}],
  plugins: [],
}
