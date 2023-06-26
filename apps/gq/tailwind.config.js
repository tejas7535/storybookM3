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
        'profile-pic-orange': '#FADED4',
        'profile-pic-blue': '#C7E8FD',
        'profile-pic-red': '#F7D2DC',
        'profile-pic-green': '#C3E9D9',
        'profile-pic-purple': '#C6D5F1',
      },
      textColor: {
        orange: colors.orange,
        'profile-initials-orange': '#BE6953',
        'profile-initials-blue': '#43789D',
        'profile-initials-red': '#CF5C76',
        'profile-initials-green': '#4A8068',
        'profile-initials-purple': '#0849C9',
      },
    },
  },
  plugins: [],
};
