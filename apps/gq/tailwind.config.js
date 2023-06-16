const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const colors = require('../../libs/shared/ui/styles/src/lib/tailwind/colors');

const { join } = require('path');
const {
  schaefflerTailwindPreset,
} = require('../../libs/shared/ui/styles/src/lib/tailwind/preset');

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
        'navy-blue': '#16223B',
        'navy-gray': '#444E61',
        'gray-300': '#F0F0F0',
      },
      textColor: {
        orange: colors.orange,
      },
    },
  },
  plugins: [],
};
