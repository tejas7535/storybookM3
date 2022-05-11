const { createGlobPatternsForDependencies } = require('@nrwl/angular/tailwind');
const { join } = require('path');

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
  presets: [require('../../tailwind.config')],
  theme: {
    extend: {
      colors: {
        secondary: secondaryColorPalette,
        'light-red': '#EFCCD2',
      },
    },
  },
  plugins: [],
};
