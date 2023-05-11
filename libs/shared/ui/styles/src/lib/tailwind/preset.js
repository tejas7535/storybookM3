// const defaultTheme = require('tailwindcss/defaultTheme'); // will be used as soon as the theme is extended

const plugin = require('tailwindcss/plugin');
const colors = require('./colors');
const fontSizes = require('./font-sizes');

const baseColors = {
  primary: colors.primary,
  'primary-variant': colors['primary-variant'],
  secondary: colors.secondary,
  'secondary-variant': colors['secondary-variant'],
  'secondary-900': colors['secondary-900'],
  'background-dark': colors['background-dark'],
  surface: colors['surface'],
  error: colors['error-red'],
  'sunny-yellow': colors['sunny-yellow'],
  'nordic-blue': colors['nordic-blue'],
  lime: colors.lime,
  orange: colors.orange,
};

const greys = {
  'hover-overlay': 'rgba(0,0,0,0.04)',
  'focus-overlay': 'rgba(0,0,0,0.08)',
  'selected-overlay': 'rgba(0,0,0,0.12)',
  'disabled-overlay': 'rgba(129,129,129,0.12)',
};

const gradientColors = {
  heatmapBlue: 'rgb(3, 147, 240)',
  heatmapDeepMagenta: 'rgb(177, 27, 172)',
  heatmapRed: 'rgb(251, 36, 36)',
};

const emphasis = {
  'high-emphasis': colors['dark-high-emphasis'],
  'medium-emphasis': colors['dark-medium-emphasis'],
  'low-emphasis': colors['dark-low-emphasis'],

  'high-emphasis-dark-bg': colors['light-high-emphasis'],
  'medium-emphasis-dark-bg': colors['light-medium-emphasis'],
  'low-emphasis-dark-bg': colors['light-low-emphasis'],
};

const border = {
  border: colors.border,
  primary: colors.primary,
  info: colors['nordic-blue'],
  warning: colors['sunny-yellow'],
  attention: colors.orange,
  'medium-emphasis': colors['medium-emphasis'],
};

const fontFamilies = {
  sans: ['Noto sans'],
  materialIcons: ['Material Icons'],
};

const plugins = [
  plugin(function ({ addBase, theme }) {
    // override native elements styles
    addBase({
      body: {
        fontFamily: fontFamilies.sans,
        color: theme('textColor.emphasis.high-emphasis'),
      },
      h2: {
        fontSize: theme('fontSize.h2'),
        lineHeight: fontSizes['h2'][1].lineHeight,
      },
      h3: {
        fontSize: theme('fontSize.h3'),
        lineHeight: fontSizes['h3'][1].lineHeight,
      },
      h4: {
        fontSize: theme('fontSize.h4'),
        lineHeight: fontSizes['h4'][1].lineHeight,
      },
      h5: {
        fontSize: theme('fontSize.h5'),
        lineHeight: fontSizes['h5'][1].lineHeight,
      },
      h6: {
        fontSize: theme('fontSize.h6'),
        lineHeight: fontSizes['h6'][1].lineHeight,
      },
    });
  }),
  plugin(function ({ addComponents, theme }) {
    addComponents({
      '.text-subtitle-1': {
        fontWeight: theme('fontWeight.medium'),
      },
      '.text-subtitle-2': {
        fontWeight: theme('fontWeight.medium'),
      },
      '.text-button': {
        fontWeight: theme('fontWeight.medium'),
        textTransform: 'uppercase',
      },
      '.text-caption': {
        fontWeight: theme('fontWeight.medium'),
      },
      '.text-overline': {
        fontWeight: theme('fontWeight.medium'),
        textTransform: 'uppercase',
      },
    });
  }),
];

const theme = {
  colors: {
    ...baseColors,
    ...greys,
    ...emphasis,
    transparent: 'rgba(0,0,0,0)',
  },
  gradientColorStops: (theme) => ({
    ...theme('colors'),
    ...gradientColors,
  }),
  borderColor: {
    ...border,
  },
  fontSize: fontSizes,
  fontFamily: {
    // set custom utility classes
    display: fontFamilies.sans,
    body: fontFamilies.sans,
    materiaIcons: fontFamilies.materialIcons,
  },
  textColor: {
    white: colors['secondary'],
    error: colors['error-text'],
    link: colors['link-text'],
    info: colors['nordic-blue'],
    warning: colors['sunny-yellow'],
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
};

const schaefflerTailwindPreset = {
  theme,
  plugins,
};

module.exports = {
  schaefflerTailwindPreset,
};
