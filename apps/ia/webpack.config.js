const I18nChecksumPlugin = require('../../tools/webpack/i18n-checksum-plugin');

module.exports = {
  plugins: [
    new I18nChecksumPlugin(
      'apps/ia/src/assets/i18n',
      'apps/ia/src/i18n-checksums.json'
    ),
  ],
};
