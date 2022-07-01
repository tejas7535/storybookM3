const { createGlobPatternsForDependencies } = require('@nrwl/angular/tailwind');
const { join } = require('path');
const {
  schaefflerTailwindPreset,
} = require('../styles/src/lib/tailwind/preset');

module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  presets: [schaefflerTailwindPreset],
  theme: {
    extend: {},
  },
  plugins: [],
};
