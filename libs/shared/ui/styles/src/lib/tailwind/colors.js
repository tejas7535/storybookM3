// must be same as libs\shared\ui\styles\src\lib\schaeffler-colors.scss
// Docs: https://zeroheight.com/4a06fad55/v/latest/p/7341fd-ui-colors

const colors = {
  // Foundational colors
  primary: '#00893d',
  white: '#ffffff',
  disabled: 'rgba(0, 0, 0, 0.38)',
  inactive: 'rgba(0, 0, 0, 0.6)',
  active: 'rgba(0, 0, 0, 0.87)',
  default: 'rgba(0, 0, 0, 0.12)',

  // Color Schema
  'primary-variant': '#e5f4e9',
  secondary: '#ffffff',
  'secondary-legacy': '#ffffff', // temporary color to replace occurences of $secondary for m2 theme
  'secondary-variant': '#f5f5f5',
  'secondary-900': '#3c3c3c',

  'background-dark': '#f5f5f5',
  surface: '#ffffff',
  'surface-legacy': '#ffffff', // temporary color to replace occurences of $surface for m2 theme

  // Functional colors
  error: '#cb0b15',
  link: '#00893d',
  info: '#1c98b5',
  warning: '#e9b300',
  success: '#a1c861',

  // Text
  'high-emphasis': 'rgba(0, 0, 0, 0.87)',
  'medium-emphasis': 'rgba(0, 0, 0, 0.6)',
  'low-emphasis': 'rgba(0, 0, 0, 0.38)',

  'white-high-emphasis': 'rgb(255, 255, 255)',
  'white-medium-emphasis': 'rgba(255, 255, 255, 0.6)',
  'white-low-emphasis': 'rgba(255, 255, 255, 0.38)',

  // Functional text colors
  'text-error': '#a30f0c',
  'text-link': '#00893d',
  'text-info': '#00596e',
  'text-warning': '#814e00',
  'text-success': '#3C7029',

  // Outline
  border: 'rgba(0, 0, 0, 0.12)',
};

module.exports = colors;
