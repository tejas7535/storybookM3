const spawn = require('child_process').spawn;

class I18nChecksumPlugin {
  input;
  output;
  constructor(input, output) {
    this.input = input;
    this.output = output;
  }

  // Define `apply` as its prototype method which is supplied with compiler as its argument
  apply(compiler) {
    compiler.hooks.beforeCompile.tap('I18nChecksumPlugin', () => {
      spawn('node', [
        'tools/webpack/i18n-checksum.js',
        '--in',
        this.input,
        '--out',
        this.output,
      ]);
    });
  }
}

module.exports = I18nChecksumPlugin;
