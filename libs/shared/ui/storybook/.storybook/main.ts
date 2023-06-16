import { StorybookConfig } from '@storybook/angular';
import rootMain from '../../../../../.storybook/main';
const config: StorybookConfig = {
  ...rootMain,
  core: {
    disableTelemetry: true,
  },
  stories: ['../src/lib/**/*.stories.@(ts|js)'],
  staticDirs: ['../src/assets'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    'storybook-addon-designs',
    '@storybook/addon-storysource',
    'storybook-dark-mode',
    '@geometricpanda/storybook-addon-badges',
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

module.exports = config;
