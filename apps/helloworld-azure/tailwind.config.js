const { join } = require('path');
const {
  schaefflerTailwindPreset,
} = require('../../libs/shared/ui/styles/src/lib/tailwind/preset');

module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    join(__dirname, '../../libs/shared/**/*.{ts,html}'),
  ],
  presets: [schaefflerTailwindPreset],
  safelist: [{ pattern: /grid-cols-/ }],
  theme: {
    extend: {},
  },
  plugins: [],
};
