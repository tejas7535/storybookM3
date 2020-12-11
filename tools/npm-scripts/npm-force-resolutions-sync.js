const fs = require('fs');
const execSync = require('child_process').execSync;

console.log('TRYING TO UPDATE RESOLUTIONS');

const packageJson = JSON.parse(
  fs.readFileSync(`${__dirname}/../../package.json`)
);

for (const [key, value] of Object.entries(packageJson.resolutions)) {
  let writePackageJson = false;

  if (packageJson.dependencies[key]) {
    if (packageJson.dependencies[key] !== value) {
      packageJson.resolutions[key] = packageJson.dependencies[key];
      writePackageJson = true;
    }
  } else if (packageJson.devDependencies[key]) {
    if (packageJson.devDependencies[key] !== value) {
      packageJson.resolutions[key] = packageJson.devDependencies[key];
      writePackageJson = true;
    }
  }

  if (writePackageJson) {
    console.log('Updating npm-force-resolutions versions in package.json');
    fs.writeFileSync(
      `${__dirname}/../../package.json`,
      JSON.stringify(packageJson, null, 2).concat('\n')
    );

    console.log('Running npm-force-resolutions to force new version');
    execSync(`npm run force-resolutions`, { stdio: 'inherit' });
  }
}
