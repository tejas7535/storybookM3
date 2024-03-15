const crypto = require('crypto');
const fs = require('fs');
const { globSync } = require('glob');

const generateChecksum = (string) =>
  crypto.createHash('md5').update(string, 'utf8').digest('hex');

const generateChecksums = (input, output) => {
  const result = {};

  globSync(input + '/**/*.json').forEach((path) => {
    const [_, lang] = path.split(input + '/');
    const content = fs.readFileSync(path, { encoding: 'utf-8' });
    if (!lang) {
      return;
    }
    result[lang.replace('.json', '')] = generateChecksum(content);
  });

  fs.writeFileSync(output, JSON.stringify(result));
};

module.exports = generateChecksums;
