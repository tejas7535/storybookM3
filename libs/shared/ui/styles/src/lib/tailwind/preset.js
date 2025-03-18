// const defaultTheme = require('tailwindcss/defaultTheme'); // will be used as soon as the theme is extended

const plugin = require('tailwindcss/plugin');
const colors = require('./colors');
const fontSizes = require('./font-sizes');

// generate color class based on variable with opacity option
const generateColorClass = (variable) => {
  return ({ opacityValue }) =>
    opacityValue
      ? `rgba(var(--${variable}), ${opacityValue})`
      : `rgb(var(--${variable}))`;
};

const materialsRoleColors = {
  primary: generateColorClass('primary-color'),
  'on-primary': 'var(--on-primary-color)',
  'primary-container': 'var(--primary-container-color)',
  'on-primary-container': 'var(--on-primary-container-color)',
  'primary-fixed': 'var(--primary-fixed-color)',
  'primary-fixed-dim': 'var(--primary-fixed-dim-color)',
  'on-primary-fixed': 'var(--on-primary-fixed-color)',
  'on-primary-fixed-variant': 'var(--on-primary-fixed-variant-color)',
  secondary: {
    DEFAULT: generateColorClass('secondary-color'),
  },
  'on-secondary': 'var(--on-secondary-color)',
  'secondary-container': 'var(--secondary-container-color)',
  'on-secondary-container': 'var(--on-secondary-container-color)',
  'secondary-fixed': 'var(--secondary-fixed-color)',
  'secondary-fixed-dim': 'var(--secondary-fixed-dim-color)',
  'on-secondary-fixed': 'var(--on-secondary-fixed-color)',
  'on-secondary-fixed-variant': 'var(--on-secondary-fixed-variant-color)',
  tertiary: 'var(--tertiary-color)',
  'on-tertiary': 'var(--on-tertiary-color)',
  'tertiary-container': 'var(--tertiary-container-color)',
  'on-tertiary-container': 'var(--on-tertiary-container-color)',
  'tertiary-fixed': 'var(--tertiary-fixed-color)',
  'tertiary-fixed-dim': 'var(--tertiary-fixed-dim-color)',
  'on-tertiary-fixed': 'var(--on-tertiary-fixed-color)',
  'on-tertiary-fixed-variant': 'var(--on-tertiary-fixed-variant-color)',
  error: 'var(--error-color)',
  'on-error': 'var(--on-error-color)',
  'error-container': 'var(--error-container-color)',
  'on-error-container': 'var(--on-error-container-color)',
  'surface-dim': 'var(--surface-dim-color)',
  surface: 'var(--surface-color)',
  'surface-bright': 'var(--surface-bright-color)',
  'surface-container-lowest': 'var(--surface-container-lowest-color)',
  'surface-container-low': 'var(--surface-container-low-color)',
  'surface-container': 'var(--surface-container-color)',
  'surface-container-high': 'var(--surface-container-high-color)',
  'surface-container-highest': 'var(--surface-container-highest-color)',
  'on-surface': 'var(--on-surface-color)',
  'on-surface-variant': 'var(--on-surface-variant-color)',
  'surface-variant': 'var(--surface-variant-color)',
  outline: 'var(--outline-color)',
  'outline-variant': 'var(--outline-variant-color)',
  'inverse-surface': 'var(--inverse-surface-color)',
  'inverse-on-surface': 'var(--inverse-on-surface-color)',
  'inverse-primary': 'var(--inverse-primary-color)',
  scrim: 'var(--scrim-color)',
  shadow: 'var(--shadow-color)',
};

const baseColors = {
  white: colors.white,
  disabled: colors.disabled,
  inactive: colors.inactive,
  active: colors.active,
  default: colors.default,
  'primary-variant': colors['primary-variant'],
  'secondary-legacy': colors['secondary-legacy'],
  'secondary-variant': colors['secondary-variant'],
  'secondary-900': colors['secondary-900'],
};

const backgroundColors = {
  warning: 'var(--warning)',
  'warning-container': 'var(--warning-container)',
  info: 'var(--info)',
  'info-container': 'var(--info-container)',
  success: 'var(--success)',
  'success-container': 'var(--success-container)',
  'category-1': 'var(--category-1)',
  'category-1-container': 'var(--category-1-container)',
  'category-2': 'var(--category-2)',
  'category-2-container': 'var(--category-2-container)',
  'category-3': 'var(--category-3)',
  'category-3-container': 'var(--category-3-container)',
  'background-dark': colors['background-dark'],
  surface: colors['surface'],
  'surface-legacy': colors['surface-legacy'],
};

const functionalColors = {
  link: materialsRoleColors.primary,
};

const functionalIconColors = {
  'icon-error': materialsRoleColors.error,
  'icon-link': colors.link,
  'icon-info': 'var(--info)',
  'icon-warning': 'var(--warning)',
  'icon-success': 'var(--success)',
  'icon-disabled': colors.disabled,
  'icon-inactive': colors.inactive,
  'icon-active': colors.active,
};

const functionalTextColors = {
  link: materialsRoleColors.primary,
  info: colors['text-info'],
  warning: colors['text-warning'],
  success: colors['text-success'],
  'on-warning-container': 'var(--on-warning-container)',
  'on-info-container': 'var(--on-info-container)',
  'on-success-container': 'var(--on-success-container)',
  'on-category-1-container': 'var(--on-category-1-container)',
  'on-category-2-container': 'var(--on-category-2-container)',
  'on-category-3-container': 'var(--on-category-3-container)',
};

const greys = {
  'hover-overlay': 'rgba(0,0,0,0.04)',
  'focus-overlay': 'rgba(0,0,0,0.08)',
  'selected-overlay': 'rgba(0,0,0,0.12)',
  'disabled-overlay': 'rgba(129,129,129,0.12)',
  'backdrop-overlay': 'rgba(0,0,0,0.32)',
};

const emphasis = {
  'high-emphasis': 'var(--high-emphasis-color)',
  'medium-emphasis': 'var(--medium-emphasis-color)',
  'low-emphasis': 'var(--low-emphasis-color)',

  'white-low-emphasis': colors['white-low-emphasis'],
  'white-medium-emphasis': colors['white-medium-emphasis'],
  'white-high-emphasis': colors['white-high-emphasis'],
};

const border = {
  border: colors.border,
  'medium-emphasis': colors['medium-emphasis'],
  warning: 'var(--warning)',
  info: 'var(--info)',
  success: 'var(--success)',
  'category-1': 'var(--category-1)',
  'category-2': 'var(--category-2)',
  'category-3': 'var(--category-3)',
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
      '.text-display-large': {
        font: 'var(--font-display-large)',
        letterSpacing: 'var(--display-large-letter-spacing)',
      },
      '.text-display-medium': {
        font: 'var(--font-display-medium)',
        letterSpacing: 'var(--display-medium-letter-spacing)',
      },
      '.text-display-small': {
        font: 'var(--font-display-small)',
        letterSpacing: 'var(--display-small-letter-spacing)',
      },
      '.text-headline-large': {
        font: 'var(--font-headline-large)',
        letterSpacing: 'var(--headline-large-letter-spacing)',
      },
      '.text-headline-medium': {
        font: 'var(--font-headline-medium)',
        letterSpacing: 'var(--headline-medium-letter-spacing)',
      },
      '.text-headline-small': {
        font: 'var(--font-headline-small)',
        letterSpacing: 'var(--headline-small-letter-spacing)',
      },
      '.text-title-large': {
        font: 'var(--font-title-large)',
        letterSpacing: 'var(--title-large-letter-spacing)',
      },
      '.text-title-medium': {
        font: 'var(--font-title-medium)',
        letterSpacing: 'var(--title-medium-letter-spacing)',
      },
      '.text-title-small': {
        font: 'var(--font-title-small)',
        letterSpacing: 'var(--title-small-letter-spacing)',
      },
      '.text-body-large': {
        font: 'var(--font-body-large)',
        letterSpacing: 'var(--body-large-letter-spacing)',
      },
      '.text-body-medium': {
        font: 'var(--font-body-medium)',
        letterSpacing: 'var(--body-medium-letter-spacing)',
      },
      '.text-body-small': {
        font: 'var(--font-body-small)',
        letterSpacing: 'var(--body-small-letter-spacing)',
      },
      '.text-label-large': {
        font: 'var(--font-label-large)',
        letterSpacing: 'var(--label-large-letter-spacing)',
      },
      '.text-label-large-prominent': {
        font: 'var(--font-label-large)',
        letterSpacing: 'var(--label-large-letter-spacing)',
        fontWeight: 600,
      },
      '.text-label-medium': {
        font: 'var(--font-label-medium)',
        letterSpacing: 'var(--label-medium-letter-spacing)',
      },
      '.text-label-medium-prominent': {
        font: 'var(--font-label-medium)',
        letterSpacing: 'var(--label-medium-letter-spacing)',
        fontWeight: 600,
      },
      '.text-label-small': {
        font: 'var(--font-label-small)',
        letterSpacing: 'var(--label-small-letter-spacing)',
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
    ...materialsRoleColors,
    transparent: 'rgba(0,0,0,0)',
  },
  backgroundColor: {
    ...baseColors,
    ...backgroundColors,
    ...greys,
    ...emphasis,
    ...materialsRoleColors,
    transparent: 'rgba(0,0,0,0)',
  },
  gradientColorStops: (theme) => ({
    ...theme('colors'),
  }),
  borderColor: {
    ...baseColors,
    ...functionalColors,
    ...border,
    ...materialsRoleColors,
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
    ...materialsRoleColors,
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
