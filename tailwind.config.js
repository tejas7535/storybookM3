// const defaultTheme = require('tailwindcss/defaultTheme'); // will be used as soon as the theme is extended
const plugin = require('tailwindcss/plugin');

module.exports = {
  prefix: '',
  purge: {
    enabled: process.env.PURGE_TAILWIND === 'true',
    content: ['./apps/**/*.{html,ts}', './libs/**/*.{html,ts,}'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      primary: '#00893D',
      white: '#fff',
      background: '#F6F7F8',
    },
    fontSize: {
      h1: ['96px', { letterSpacing: '-1.5px' }],
      h2: [
        '60px',
        {
          letterSpacing: '-0.5px',
        },
      ],
      h3: ['48px'],
      h4: [
        '34px',
        {
          letterSpacing: '0.25px',
        },
      ],
      h5: ['24px'],
      h6: [
        '20px',
        {
          letterSpacing: '0.25px',
        },
      ],
      'body-1': [
        '16px',
        {
          letterSpacing: '0.5px',
        },
      ],
      'body-2': [
        '14px',
        {
          letterSpacing: '0.25px',
        },
      ],
      'subtitle-1': [
        '16px',
        {
          letterSpacing: '0.15px',
        },
      ],
      'subtitle-2': [
        '14px',
        {
          letterSpacing: '0.1px',
        },
      ],
      button: [
        '14px',
        {
          letterSpacing: '1.25px',
        },
      ],
      caption: [
        '12px',
        {
          letterSpacing: '0.4px',
        },
      ],
      overline: [
        '12px',

        {
          letterSpacing: '2px',
        },
      ],
    },
    fontFamily: {
      body: ['Roboto', 'sans-serif'],
    },
    textColor: {
      dark: 'rgba(0,0,0,0.87)',
      light: 'rgba(0,0,0,0.60)',
      white: '#fff',
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    plugin(function ({ addBase, theme }) {
      addBase({
        h1: {
          fontSize: theme('fontSize.h1'),
          fontWeight: theme('fontWeight.light'),
          color: theme('textColor.dark'),
        },
        h2: {
          fontSize: theme('fontSize.h2'),
          fontWeight: theme('fontWeight.light'),
          color: theme('textColor.dark'),
        },
        h3: {
          fontSize: theme('fontSize.h3'),
          color: theme('textColor.dark'),
        },
        h4: {
          fontSize: theme('fontSize.h4'),
          color: theme('textColor.dark'),
        },
        h5: {
          fontSize: theme('fontSize.h5'),
          color: theme('textColor.dark'),
        },
        h6: {
          fontSize: theme('fontSize.h6'),
          fontWeight: theme('fontWeight.medium'),
          color: theme('textColor.dark'),
        },
      });
    }),
    plugin(function ({ addComponents, theme }) {
      addComponents({
        '.text-body-1': {
          color: theme('textColor.light'),
        },
        '.text-body-2': {
          color: theme('textColor.light'),
        },
        '.text-subtitle-1': {
          color: theme('textColor.light'),
        },
        '.text-subtitle-2': {
          color: theme('textColor.light'),
        },
        '.text-caption': {
          color: theme('textColor.light'),
        },
        '.text-overline': {
          color: theme('textColor.light'),
        },
      });
    }),
  ],
};
