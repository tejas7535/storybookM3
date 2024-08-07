const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');
const colors = require('../../libs/shared/ui/styles/src/lib/tailwind/colors');
const {
  schaefflerTailwindPreset,
} = require('../../libs/shared/ui/styles/src/lib/tailwind/preset');

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
        'light-red': '#EFCCD2',
        'light-blue': '#ECF5F7',
      },
      borderColor: {
        'low-emphasis': colors['low-emphasis'],
      },
      backgroundColor: {
        'nordic-blue': colors['info'],
        secondary: secondaryColorPalette,
      },
    },
  },
  plugins: [],
};
