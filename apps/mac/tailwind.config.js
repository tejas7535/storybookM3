const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const {
  schaefflerTailwindPreset,
} = require('../../libs/shared/ui/styles/src/lib/tailwind/preset');
const { join } = require('path');

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
    extend: {},
  },
  safelist: [
    'table-auto',
    'bg-[#E4E4E4]',
    'bg-[#ABC7BF]',
    'bg-[#537C71]',
    'bg-[#006E5D]',
    'text-[#FFFFFF]',
    'text-[#000000DE]',
  ],
};
