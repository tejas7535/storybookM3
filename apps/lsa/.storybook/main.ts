import { StorybookConfig } from '@storybook/angular';

import rootMain from '../../../.storybook/main';

const config: StorybookConfig = {
  ...rootMain,
  core: {
    disableTelemetry: true,
  },
  stories: [
    ...(rootMain.stories || []),
    '../src/app/**/*.stories.mdx',
    '../src/app/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  staticDirs: ['../src/assets'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    'storybook-addon-designs',
    '@storybook/addon-storysource',
    'storybook-dark-mode',
    '@geometricpanda/storybook-addon-badges',
  ],
  // eslint-disable-next-line @typescript-eslint/no-shadow
  webpackFinal: async (config, { configType }) => {
    // apply any global webpack configs that might have been specified in .storybook/main.js
    if (rootMain.webpackFinal) {
      config = await rootMain.webpackFinal(config, { configType });
    }

    // add your own webpack tweaks if needed

    return config;
  },
};

// eslint-disable-next-line unicorn/prefer-module
module.exports = config;
