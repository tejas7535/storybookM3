// const defaultTheme = require('tailwindcss/defaultTheme'); // will be used as soon as the theme is extended
const plugin = require('tailwindcss/plugin');

const darkGrey = 'rgba(0,0,0,0.87)';
const mediumGrey = 'rgba(0,0,0,.6)';
const lightGrey = 'rgba(0,0,0,0.38)';
const veryLightGrey = 'rgba(0,0,0,0.11)';

const baseColors = {
  primary: '#00893D',
  secondary: '#005f14',
  disabledPrimary: '#99d0b1',
  error: '#e62c27',
  warning: '#fccf46',
  informationAccent: '#1d9bb2',
  success: '#0ebc5b',
  highlightedTableCell: '#e1eece',
  activeTableCell: '#e5f3eb',
};

const greys = {
  inputFieldAltBg: '#f6f7f8',
  hover: '#ebeef0',
  background: '#dde3e6',
  border: '#ced5da',
  labels: '#9ca2a5',
  toastBg: '#414546',
  lightBg: 'rgba(0,0,0,0.11)',
};

const emphasis = {
  highEmphasis: darkGrey,
  mediumEmphasis: mediumGrey,
  disabled: veryLightGrey,
};

const scrollSnapUtilities = {
  '.snap-y-mandatory': {
    'scroll-snap-type': 'y mandatory',
  },
  '.snap-x-mandatory': {
    'scroll-snap-type': 'x mandatory',
  },
  '.snap-y-proximity': {
    'scroll-snap-type': 'y proximity',
  },
  '.snap-x-proximity': {
    'scroll-snap-type': 'x proximity',
  },
  '.snap-start': {
    'scroll-snap-align': 'start',
  },
  '.snap-end': {
    'scroll-snap-align': 'end',
  },
  '.snap-center': {
    'scroll-snap-align': 'center',
  },
  '.no-snap': {
    '.scroll-snap-type': 'none',
  },
  '.snap-both': {
    'scroll-snap-direction': 'both',
  },
  '.snap-block': {
    'scroll-snap-direction': 'block',
  },
  '.snap-inline': {
    'scroll-snap-direction': 'inline',
  },
};

module.exports = {
  prefix: '',
  purge: {
    content: ['./apps/**/*.{html,ts}', './libs/**/*.{html,ts}'],
  },
  mode: 'jit',
  darkMode: false, // or 'media' or 'class'
  theme: {
    borderColor: (theme) => ({
      ...theme('colors'),
      dark: 'rgba(0,0,0,0.87)',
      light: 'rgba(0,0,0,0.60)',
      veryLight: 'rgba(0,0,0,0.38)',
    }),
    colors: {
      ...baseColors,
      ...greys,
      ...emphasis,
      white: '#fff',
      transparent: 'rgba(0,0,0,0)',
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
      dark: darkGrey,
      light: mediumGrey,
      primary: '#00893D',
      white: '#fff',
      disabled: lightGrey,
      error: baseColors.error,
    },
    screens: {
      sm: '600px',
      md: '960px',
      lg: '1280px',
      xl: '1920px',
    },
    extend: {
      opacity: {
        8: '0.08',
      },
      transitionProperty: {
        maxHeight: 'max-height',
      },
      transitionTimingFunction: {
        default: 'cubic-bezier(0.87, 0, 0.13, 1)',
      },
    },
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
    plugin(function ({ addUtilities }) {
      addUtilities(scrollSnapUtilities);
    }),
  ],
};
