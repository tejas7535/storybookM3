const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');
const {
  schaefflerTailwindPreset,
} = require('../../libs/shared/ui/styles/src/lib/tailwind/preset');
const colors = require('../../libs/shared/ui/styles/src/lib/tailwind/colors');

const secondaryColorPalette = {
  50: '#E5F4E9',
  100: '#C0E4C9',
  200: '#98D3A7',
  300: '#6CC385',
  400: '#49B66B',
  500: '#1CAA52',
  600: '#129B49',
  700: '#00893D',
  800: '#007832',
  900: '#00591F',
};

module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(
      __dirname,
      '../**/!(*.stories|*.spec).{ts,html}'
    ),
  ],
  presets: [schaefflerTailwindPreset],
  theme: {
    extend: {
      colors: {
        secondary: secondaryColorPalette,
      },
      backgroundColor: {
        warning: '#FFFBEF',
        info: '#F0F6FA',
      },
      borderColor: {
        warning: '#E9B300',
        info: '#1C98B5',
      },
      textColor: {
        primary: colors.primary,
        secondary: secondaryColorPalette,
        'warning-icon': '#E9B300',
        'info-icon': '#1C98B5',
        warning: '#814E00',
        info: '#00596E',
      },
    },
  },
  important: 'engineering-app',
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
