const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');
const {
  schaefflerTailwindPreset,
} = require('../../libs/shared/ui/styles/src/lib/tailwind/preset');

const generateColorClass = (variable) => {
  return ({ opacityValue }) =>
    opacityValue
      ? `rgba(var(--${variable}), ${opacityValue})`
      : `rgb(var(--${variable}))`;
};

const overwriteColors = {
  primary: generateColorClass('primary'),
  'primary-variant': generateColorClass('primary-variant'),
};

const overwriteTextColors = {
  link: generateColorClass('primary'),
};

const overwriteBackgroundColors = {
  orange: '#E9B300',
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
        ...overwriteColors,
      },
      textColor: {
        ...overwriteTextColors,
      },
      backgroundColor: {
        ...overwriteBackgroundColors,
        ...overwriteColors,
      },
    },
  },
  safelist: [
    'partner-version',
    'partner-version-schmeckthal-gruppe',
    {
      pattern: /text-.+/,
      variants: ['partner-version-schmeckthal-gruppe'],
    },
  ],
  plugins: [require('@tailwindcss/typography')],
};
