const rootMain = require('../../../../../.storybook/main');

module.exports = {
  ...rootMain,
  stories: ['../src/lib/**/*.stories.@(ts|js)'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-actions',
    '@storybook/addon-storysource',
    '@storybook/addon-viewport',
    '@storybook/addon-notes/register',
    '@storybook/addon-backgrounds',
    '@storybook/addon-controls',
    '@storybook/addon-essentials',
    'storybook-addon-designs',
  ],
  webpackFinal: async (config, { configType }) => {
    // apply any global webpack configs that might have been specified in .storybook/main.js
    if (rootMain.webpackFinal) {
      config = await rootMain.webpackFinal(config, { configType });
    }

    // add your own webpack tweaks if needed

    return config;
  },
};

module.exports.core = { ...module.exports.core, builder: 'webpack5' };
