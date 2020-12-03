const fs = require('fs');
const pathModule = require('path');

/**
 * Constants
 */
const CHANGELOG_HEADER =
  '# CHANGELOG\r\n\r\n**Note:** old/deprecated changelog can be found [here](https://gitlab.schaeffler.com/frontend-schaeffler/schaeffler-frontend/-/blob/184ca646a740a82b55eee4f43c56c076a0ca82e2/CHANGELOG.md)\r\n\r\n';

/**
 * Utility functions
 */
const getOldChangelog = () => {
  const oldChangelog = fs.readFileSync('CHANGELOG.md', 'utf8');
  // remove #CHANGELOG
  let newChangelog = oldChangelog.replace(CHANGELOG_HEADER, '');

  return newChangelog;
};

const getPackageJSON = (path) => {
  let packageJson = '';

  try {
    packageJson = JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch (_e) {
    throw new Error(`Invalid path: ${path}`);
  }

  return packageJson;
};

const writeNewChangelog = (newContent) => {
  const newChangelog = `${CHANGELOG_HEADER}${newContent}\r\n\r\n${getOldChangelog()}`;

  fs.writeFile('CHANGELOG.md', newChangelog, () => {
    console.log('New changelog generated');
  });
};

const getLibsFilePaths = (path, files, result) => {
  files = files || fs.readdirSync(path);
  result = result || [];

  files.forEach((file) => {
    const newPath = pathModule.join(path, file);

    if (fs.statSync(newPath).isDirectory()) {
      result = getLibsFilePaths(newPath, fs.readdirSync(newPath), result);
    } else if (file === 'package.json' && !result.includes(path)) {
      result.push(path);
    }
  });

  return result;
};

/**
 * Create changelog yargs command
 */
require('yargs')(process.argv.slice(2))
  .command(
    '$0',
    'create new changelog entry with name and affected projects',
    (yargs) => {
      yargs
        .option('app', {
          describe: 'name of the app that is released',
          alias: 'a',
          type: 'string',
        })
        .option('name', {
          describe: 'name of the release',
          alias: 'n',
          default: new Date().toLocaleDateString(),
        })
        .option('libs', {
          describe: 'Is it a libs release?',
          alias: 'l',
          type: 'boolean',
          default: false,
        })
        .check((argv, _options) => {
          if ((argv.libs && argv.app) || (!argv.libs && !argv.app)) {
            throw new Error(
              'Please provide either an app name for an app release or set libs to true for a libs release.'
            );
          } else {
            return true;
          }
        });
    },
    (argv) => {
      const name = argv.name;
      let newContent = `## ${name}\r\n`;

      if (argv.libs) {
        // libs release
        const libsPath = './libs';

        const libsFolders = getLibsFilePaths(libsPath);

        libsFolders.forEach((lib) => {
          const packageJsonPath = `${lib}/package.json`;
          const packageJson = getPackageJSON(packageJsonPath);
          const linkToLibChangelog = `${lib}/CHANGELOG.md`;

          newContent += `* ${packageJson.name}: [${packageJson.version}](${linkToLibChangelog})\r\n`;
        });
      } else {
        // app release
        const app = argv.app;
        const appPath = `./apps/${app}/package.json`;
        const version = getPackageJSON(appPath).version;
        const linkToAppChangelog = `./apps/${app}/CHANGELOG.md`;

        newContent += `* ${app}: [${version}](${linkToAppChangelog})`;
      }

      // save new changelog
      writeNewChangelog(newContent);
    }
  )
  .help().argv;
