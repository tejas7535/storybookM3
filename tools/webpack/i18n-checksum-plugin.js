const generateChecksums = require('./i18n-checksum');

class I18nChecksumPlugin {
  input;
  output;
  constructor(input, output) {
    this.input = input;
    this.output = output;
  }

  // Define `apply` as its prototype method which is supplied with compiler as its argument
  apply(compiler) {
    compiler.hooks.entryOption.tap('I18nChecksumPlugin', () => {
      generateChecksums(this.input, this.output);
    });
  }
}

module.exports = I18nChecksumPlugin;
