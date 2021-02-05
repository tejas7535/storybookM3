const I18nChecksumPlugin = require('../../tools/webpack/i18n-checksum-plugin');

module.exports = (config) => {
  return {
    ...config,
    plugins: [
      ...config.plugins,
      new I18nChecksumPlugin(
        'apps/cdba/src/assets/i18n',
        'apps/cdba/src/i18n-checksums.json'
      ),
    ],
  };
};
