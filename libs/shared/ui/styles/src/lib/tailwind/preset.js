// const defaultTheme = require('tailwindcss/defaultTheme'); // will be used as soon as the theme is extended

const plugin = require('tailwindcss/plugin');
const colors = require('./colors');
const fontSizes = require('./font-sizes');

const baseColors = {
  primary: colors.primary,
  white: colors.white,
  disabled: colors.disabled,
  inactive: colors.inactive,
  active: colors.active,
  default: colors.default,
  'primary-variant': colors['primary-variant'],
  secondary: colors.secondary,
  'secondary-variant': colors['secondary-variant'],
  'secondary-900': colors['secondary-900'],
};

const backgroundColors = {
  error: colors['bg-error'],
  info: colors['bg-info'],
  warning: colors['bg-warning'],
  success: colors['bg-success'],
  'background-dark': colors['background-dark'],
  surface: colors['surface'],
};

const functionalColors = {
  error: colors.error,
  link: colors.link,
  info: colors.info,
  warning: colors.warning,
  success: colors.success,
};

const functionalIconColors = {
  'icon-error': colors.error,
  'icon-link': colors.link,
  'icon-info': colors.info,
  'icon-warning': colors.warning,
  'icon-success': colors.success,
  'icon-disabled': colors.disabled,
  'icon-inactive': colors.inactive,
  'icon-active': colors.active,
};

const functionalTextColors = {
  error: colors['text-error'],
  link: colors['text-link'],
  info: colors['text-info'],
  warning: colors['text-warning'],
  success: colors['text-success'],
};

const greys = {
  'hover-overlay': 'rgba(0,0,0,0.04)',
  'focus-overlay': 'rgba(0,0,0,0.08)',
  'selected-overlay': 'rgba(0,0,0,0.12)',
  'disabled-overlay': 'rgba(129,129,129,0.12)',
  'backdrop-overlay': 'rgba(0,0,0,0.32)',
};

const emphasis = {
  'high-emphasis': colors['high-emphasis'],
  'medium-emphasis': colors['medium-emphasis'],
  'low-emphasis': colors['low-emphasis'],

  'white-low-emphasis': colors['white-low-emphasis'],
  'white-medium-emphasis': colors['white-medium-emphasis'],
  'white-high-emphasis': colors['white-high-emphasis'],
};

const border = {
  border: colors.border,
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
    ...functionalColors,
    ...greys,
    ...emphasis,
    transparent: 'rgba(0,0,0,0)',
  },
  backgroundColor: {
    ...baseColors,
    ...backgroundColors,
    ...greys,
    ...emphasis,
    transparent: 'rgba(0,0,0,0)',
  },
  gradientColorStops: (theme) => ({
    ...theme('colors'),
  }),
  borderColor: {
    ...baseColors,
    ...functionalColors,
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
    ...functionalTextColors,
    ...functionalIconColors,
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
