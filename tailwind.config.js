// const defaultTheme = require('tailwindcss/defaultTheme'); // will be used as soon as the theme is extended
const fontSizes = require('./tailwind/fontSizes.ts');

const plugin = require('tailwindcss/plugin');

const darkGrey = 'rgba(0,0,0,0.87)';
const mediumGrey = 'rgba(0,0,0,0.6)';
const lightGrey = 'rgba(0,0,0,0.38)';
const veryLightGrey = 'rgba(0,0,0,0.12)';

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
  background: '#f5f5f5',
  border: '#ced5da',
  labels: '#9ca2a5',
  toastBg: '#414546',
  lightBg: 'rgba(0,0,0,0.11)',
  disabledOverlay: 'rgba(129,129,129,0.12)',
};

const emphasis = {
  highEmphasis: darkGrey,
  mediumEmphasis: mediumGrey,
  lowEmphasis: lightGrey,
  outline: veryLightGrey, // should be renamed to design naming
};

const fontFamilies = {
  sans: ['Roboto, sans-serif'],
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
    colors: {
      ...baseColors,
      ...greys,
      ...emphasis,
      white: '#fff',
      transparent: 'rgba(0,0,0,0)',
    },
    borderColor: (theme) => ({
      ...theme('colors'),
      ...emphasis,
      dark: 'rgba(0,0,0,0.87)',
      light: 'rgba(0,0,0,0.60)',
      veryLight: 'rgba(0,0,0,0.38)',
    }),
    fontSize: fontSizes,
    fontFamily: {
      // set custom utility classes
      display: fontFamilies.sans,
      body: fontFamilies.sans,
    },
    textColor: {
      dark: darkGrey,
      light: mediumGrey,
      primary: '#00893D',
      white: '#fff',
      disabled: lightGrey,
      error: baseColors.error,
      warning: baseColors.warning,
      ...emphasis,
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
    require('@tailwindcss/custom-forms'),
    plugin(function ({ addBase, theme }) {
      const sm = theme('screens.sm', {});

      // override native elements styles
      addBase({
        body: {
          fontFamily: fontFamilies.sans,
          color: theme('textColor.dark'),
        },
        h1: {
          fontSize: theme('fontSize.h1-mobile'),
          fontWeight: theme('fontWeight.light'),
          letterSpacing: fontSizes['h1-mobile'][1].letterSpacing,
          lineHeight: fontSizes['h1-mobile'][1].lineHeight,
          [`@media (min-width: ${sm})`]: {
            fontSize: theme('fontSize.h1'),
            lineHeight: fontSizes['h1'][1].lineHeight,
            letterSpacing: fontSizes['h1'][1].letterSpacing,
          },
        },
        h2: {
          fontSize: theme('fontSize.h2-mobile'),
          fontWeight: theme('fontWeight.light'),
          color: theme('textColor.dark'),
          letterSpacing: fontSizes['h2-mobile'][1].letterSpacing,
          lineHeight: fontSizes['h2-mobile'][1].lineHeight,
          [`@media (min-width: ${sm})`]: {
            fontSize: theme('fontSize.h2'),
            lineHeight: fontSizes['h2'][1].lineHeight,
          },
        },
        h3: {
          fontSize: theme('fontSize.h3-mobile'),
          color: theme('textColor.dark'),
          lineHeight: fontSizes['h3-mobile'][1].lineHeight,
          [`@media (min-width: ${sm})`]: {
            fontSize: theme('fontSize.h3'),
            lineHeight: fontSizes['h3'][1].lineHeight,
          },
        },
        h4: {
          fontSize: theme('fontSize.h4-mobile'),
          color: theme('textColor.dark'),
          letterSpacing: fontSizes['h4-mobile'][1].letterSpacing,
          lineHeight: fontSizes['h4-mobile'][1].lineHeight,
          [`@media (min-width: ${sm})`]: {
            fontSize: theme('fontSize.h4'),
            lineHeight: fontSizes['h4'][1].lineHeight,
          },
        },
        h5: {
          fontSize: theme('fontSize.h5-mobile'),
          color: theme('textColor.dark'),
          lineHeight: fontSizes['h5-mobile'][1].lineHeight,
          [`@media (min-width: ${sm})`]: {
            fontSize: theme('fontSize.h5'),
            lineHeight: fontSizes['h5'][1].lineHeight,
          },
        },
        h6: {
          fontSize: theme('fontSize.h6-mobile'),
          fontWeight: theme('fontWeight.medium'),
          color: theme('textColor.dark'),
          letterSpacing: fontSizes['h6-mobile'][1].letterSpacing,
          lineHeight: fontSizes['h6-mobile'][1].lineHeight,
          [`@media (min-width: ${sm})`]: {
            fontSize: theme('fontSize.h6'),
            lineHeight: fontSizes['h6'][1].lineHeight,
          },
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
          fontWeight: theme('fontWeight.medium'),
          color: theme('textColor.light'),
        },
        '.text-button': {
          fontWeight: theme('fontWeight.medium'),
        },
        '.text-caption': {
          color: theme('textColor.light'),
        },
        '.text-overline': {
          color: theme('textColor.light'),
        },
        '.text-icon': {
          color: theme('textColor.dark'),
        },
      });
    }),
    plugin(function ({ addUtilities }) {
      addUtilities(scrollSnapUtilities);
    }),
  ],
};
