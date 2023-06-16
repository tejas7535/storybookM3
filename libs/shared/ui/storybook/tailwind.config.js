const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');
const {
  schaefflerTailwindPreset,
} = require('../styles/src/lib/tailwind/preset');

module.exports = {
  presets: [schaefflerTailwindPreset],
  content: [
    join(__dirname, 'src/**/*.ts'),
    ...createGlobPatternsForDependencies(__dirname, '../../**/*.{ts,html}'),
  ],
};
