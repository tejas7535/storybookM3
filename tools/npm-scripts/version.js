// @ts-check
const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');

let version = undefined;

process.argv.forEach(function (val, index, _array) {
  if (index === 2) {
    version = val;
  }
});

const file = path.resolve(
  __dirname,
  '../..',
  'libs',
  'shared',
  'ui',
  'footer',
  'src',
  'lib',
  'version.ts'
);

fs.writeFileSync(
  file,
  `// IMPORTANT: THIS FILE IS AUTO GENERATED! DO NOT MANUALLY EDIT OR CHECKIN! \nexport const VERSION = '${version}';`,
  {
    encoding: 'utf-8',
  }
);

console.log(
  chalk.green(
    `Wrote version info ${version} to ${path.relative(
      path.resolve(__dirname, '..'),
      file
    )} - AUTO GENERATED FILE (DO NOT EDIT)`
  )
);
