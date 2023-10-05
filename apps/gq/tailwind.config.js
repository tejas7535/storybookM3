const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const colors = require('../../libs/shared/ui/styles/src/lib/tailwind/colors');

const { join } = require('path');
const {
  schaefflerTailwindPreset,
} = require('../../libs/shared/ui/styles/src/lib/tailwind/preset');
const plugin = require('tailwindcss/plugin');

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
        error: '#A31739',
        'iteration-item-icon': '#9E9E9E',

        'in-progress-blue': '#007892',
        'approval-status-blue': '#007892',
        'approval-status-green': '#00893D',
        'approval-status-grey': '#666666',
        'quotation-status-green': '#517626',
      },
      backgroundColor: {
        'quotation-status-blue': '#E3F7FD',
        'quotation-status-grey': '#FAFAFA',
        'quotation-status-orange': '#FFF8E2',
        'quotation-status-red': '#FCE3E6',
        'quotation-status-green': '#F8FBF4',
        'quotation-status-dark-green': '#517626',
      },
    },
  },
  plugins: [
    // we have inconsistencies with text-h6 so, we create this class until we
    // figured which class is correct to use
    plugin(function ({ addUtilities, theme }) {
      addUtilities({
        '.gq-text-5': {
          fontWeight: theme('fontWeight.medium'),
          letterSpacing: '0.25px',
          lineHeight: '24px',
          fontSize: '20px',
        },
        '.icon-5': {
          fontSize: '20px',
        },
      });
    }),
  ],
};
