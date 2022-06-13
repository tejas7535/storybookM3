const { createGlobPatternsForDependencies } = require('@nrwl/angular/tailwind');
const { join } = require('path');

module.exports = {
  presets: [require('../../../../tailwind.config')],
  content: [
    join(__dirname, 'src/**/*.ts'),
    ...createGlobPatternsForDependencies(__dirname, '../../**/*.{ts,html}'),
  ],
};
