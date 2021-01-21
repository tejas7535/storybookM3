const fs = require('fs');
const execSync = require('child_process').execSync;

console.log('Checking if preinstall script can be executed');

if (fs.existsSync(`${__dirname}/../../node_modules`)) {
  console.log('Running preinstall script');
  execSync(`npm run force-resolutions`, { stdio: 'inherit' });
}
