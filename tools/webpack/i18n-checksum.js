const crypto = require('crypto');
const fs = require('fs');
const glob = require('glob');

const generateChecksum = (string) =>
  crypto.createHash('md5').update(string, 'utf8').digest('hex');

require('yargs')(process.argv.slice(2))
  .command(
    '$0',
    'generate checksum over i18n translation files',
    (yargs) => {
      yargs
        .option('input', {
          describe: 'input path of i18n folder',
          alias: 'in',
          type: 'string',
        })
        .option('output', {
          describe: 'output path of generated json file',
          alias: 'out',
          type: 'string',
        })
        .check((argv, _options) => {
          if (!argv.input || !argv.output) {
            throw new Error('Please provide proper inputs.');
          } else {
            return true;
          }
        });
    },
    (argv) => {
      const result = {};

      glob.sync(argv.input + '/**/*.json').forEach((path) => {
        const [_, lang] = path.split(argv.input + '/');
        const content = fs.readFileSync(path, { encoding: 'utf-8' });
        result[lang.replace('.json', '')] = generateChecksum(content);
      });

      fs.writeFileSync(argv.output, JSON.stringify(result));
    }
  )
  .help().argv;
