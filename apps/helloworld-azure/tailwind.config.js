const { join } = require('path');

module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    join(__dirname, '../../libs/shared/**/*.{ts,html}'),
  ],
  presets: [require('../../tailwind.config')],
  theme: {
    extend: {},
  },
  plugins: [],
};
