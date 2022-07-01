const { createGlobPatternsForDependencies } = require('@nrwl/angular/tailwind');
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
  safelist: [
    /**needed to make material icons work within org chart in app IA */
    "before:content-['\\e24b']",
    "before:content-['\\e5d8']",
    "before:content-['\\e313']",
    "before:content-['\\e316']",
    "before:content-['\\e26a']",
  ],
  theme: {
    extend: {
      colors: {
        lime: '#A1C861', // used in entries & exits
        'light-blue': '#78909C', // used in entries & exits
      },
    },
  },
  plugins: [],
};
