const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  prefix: '',
  purge: {
    content: ['./apps/**/*.{html,ts}', './libs/**/*.{html,ts}'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontSize: {
      xl: ['24px'],
    },
    fontFamily: {
      body: ['Roboto', 'sans-serif'],
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
