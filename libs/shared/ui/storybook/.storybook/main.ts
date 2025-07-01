const { dirname, join } = require('node:path');

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
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-designs'),
    getAbsolutePath('storybook-dark-mode'),
    getAbsolutePath('@geometricpanda/storybook-addon-badges'),
    getAbsolutePath('@storybook/addon-docs'),
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

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}
