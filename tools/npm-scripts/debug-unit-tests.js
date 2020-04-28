const execSync = require('child_process').execSync;

const arg = process.argv[2];

execSync(
  `node --inspect-brk -r ts-node/register ./node_modules/@angular/cli/bin/ng test ${arg} --runInBand`,
  { stdio: [0, 1, 2] }
);
