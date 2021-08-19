module.exports = {
  stories: ['../src/lib/**/*.stories.@(ts|js)'],
  addons: [
    '@storybook/addon-knobs',
    '@storybook/addon-a11y',
    '@storybook/addon-actions',
    '@storybook/addon-storysource',
    '@storybook/addon-viewport',
    '@storybook/addon-notes/register',
    '@storybook/addon-backgrounds',
  ],
};

module.exports.core = { ...module.exports.core, builder: 'webpack5' };
