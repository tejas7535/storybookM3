const { createGlobPatternsForDependencies } = require('@nrwl/angular/tailwind');
const { join } = require('path');

module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  presets: [require('../../tailwind.config')],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
