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
  disabledSecondary: lightGrey,
  error: '#e62c27',
  warning: '#fccf46',
  informationAccent: '#1d9bb2',
  success: '#0ebc5b',
  highlightedTableCell: '#e1eece',
  activeTableCell: '#e5f3eb',
  nordicBlue: '#ECF5F7',
  infoBlue: '#4398AF',
};

const greys = {
  inputFieldAltBg: '#f6f7f8',
  hover: '#ebeef0',
  background: '#f5f5f5',
  border: '#ced5da',
  labels: '#9ca2a5',
  toastBg: '#414546',
  disclaimerBg: '#E5F4E9',
  lightBg: 'rgba(0,0,0,0.11)',
  hoverOverlay: 'rgba(0,0,0,0.04)',
  focusOverlay: 'rgba(0,0,0,0.08)',
  disabledOverlay: 'rgba(129,129,129,0.12)',
};

const gradientColors = {
  heatmapBlue: 'rgb(3, 147, 240)',
  heatmapDeepMagenta: 'rgb(177, 27, 172)',
  heatmapRed: 'rgb(251, 36, 36)',
};

const emphasis = {
  highEmphasis: darkGrey,
  mediumEmphasis: mediumGrey,
  lowEmphasis: lightGrey,
  outline: veryLightGrey, // should be renamed to design naming
};

const fontFamilies = {
  sans: ['Roboto, sans-serif'],
  materialIcons: ['Material Icons'],
};

module.exports = {
  prefix: '',
  content: ['./apps/**/*.{html,ts}', './libs/**/*.{html,ts}'],
  safelist: [
    /**needed to make material icons work within org chart in app IA */
    "before:content-['\\e24b']",
    "before:content-['\\e5d8']",
    "before:content-['\\e313']",
    "before:content-['\\e316']",
    "before:content-['\\e26a']",
  ],
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
    gradientColorStops: (theme) => ({
      ...theme('colors'),
      ...gradientColors,
    }),
    fontSize: fontSizes,
    fontFamily: {
      // set custom utility classes
      display: fontFamilies.sans,
      body: fontFamilies.sans,
      materiaIcons: fontFamilies.materialIcons,
    },
    textColor: {
      dark: darkGrey,
      light: mediumGrey,
      primary: '#00893D',
      white: '#fff',
      disabled: lightGrey,
      error: baseColors.error,
      warning: baseColors.warning,
      success: baseColors.success,
      info: baseColors.infoBlue,
      labels: greys.labels,
      ...emphasis,
    },
    screens: {
      sm: '600px',
      md: '905px',
      lg: '1240px',
      xl: '1440px',
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
          letterSpacing: fontSizes['h2-mobile'][1].letterSpacing,
          lineHeight: fontSizes['h2-mobile'][1].lineHeight,
          [`@media (min-width: ${sm})`]: {
            fontSize: theme('fontSize.h2'),
            lineHeight: fontSizes['h2'][1].lineHeight,
          },
        },
        h3: {
          fontSize: theme('fontSize.h3-mobile'),
          lineHeight: fontSizes['h3-mobile'][1].lineHeight,
          [`@media (min-width: ${sm})`]: {
            fontSize: theme('fontSize.h3'),
            lineHeight: fontSizes['h3'][1].lineHeight,
          },
        },
        h4: {
          fontSize: theme('fontSize.h4-mobile'),
          letterSpacing: fontSizes['h4-mobile'][1].letterSpacing,
          lineHeight: fontSizes['h4-mobile'][1].lineHeight,
          [`@media (min-width: ${sm})`]: {
            fontSize: theme('fontSize.h4'),
            lineHeight: fontSizes['h4'][1].lineHeight,
          },
        },
        h5: {
          fontSize: theme('fontSize.h5-mobile'),
          lineHeight: fontSizes['h5-mobile'][1].lineHeight,
          [`@media (min-width: ${sm})`]: {
            fontSize: theme('fontSize.h5'),
            lineHeight: fontSizes['h5'][1].lineHeight,
          },
        },
        h6: {
          fontSize: theme('fontSize.h6-mobile'),
          fontWeight: theme('fontWeight.medium'),
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
        '.text-subtitle-2': {
          fontWeight: theme('fontWeight.medium'),
        },
        '.text-button': {
          fontWeight: theme('fontWeight.medium'),
        },
      });
    }),
  ],
};
