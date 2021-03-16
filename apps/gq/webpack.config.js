const I18nChecksumPlugin = require('../../tools/webpack/i18n-checksum-plugin');

module.exports = (config) => {
  return {
    ...config,
    plugins: [
      ...config.plugins,
      new I18nChecksumPlugin(
        'apps/gq/src/assets/i18n',
        'apps/gq/src/i18n-checksums.json'
      ),
    ],
  };
};
