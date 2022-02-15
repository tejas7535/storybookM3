const { createGlobPatternsForDependencies } = require('@nrwl/angular/tailwind');
const { join } = require('path');

module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  presets: [require('../../tailwind.config')],
  safelist: [
    /**needed to make material icons work within org chart in app IA */
    "before:content-['\\e24b']",
    "before:content-['\\e5d8']",
    "before:content-['\\e313']",
    "before:content-['\\e316']",
    "before:content-['\\e26a']",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
