const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');
const {
  schaefflerTailwindPreset,
} = require('../../libs/shared/ui/styles/src/lib/tailwind/preset');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  presets: [schaefflerTailwindPreset],
};
