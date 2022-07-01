const { createGlobPatternsForDependencies } = require('@nrwl/angular/tailwind');
const { join } = require('path');
const {
  schaefflerTailwindPreset,
} = require('../styles/src/lib/tailwind/preset');

module.exports = {
  presets: [schaefflerTailwindPreset],
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
