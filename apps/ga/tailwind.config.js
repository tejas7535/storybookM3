const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
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
      backgroundColor: {
        info: '#F0F6FA',
      },
      borderColor: {
        info: '#1C98B5',
      },
      textColor: {
        'info-icon': '#1C98B5',
        info: '#00596E',
      },
    },
  },
  plugins: [],
};
