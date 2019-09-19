var markdownInclude = require('markdown-include');
var path = require('path');
var fs = require('fs');
var branch = require('git-branch');

module.exports = {
  transforms: {
    VERSIONBADGE: require('markdown-magic-version-badge'),
    /* Match <!-- AUTO-GENERATED-CONTENT:START (UPDATEBADGES) --> */
    UPDATEBADGES(_content, options) {
      const currentBranch = branch.sync();
      let badges = fs.readFileSync(path.resolve(options.path)).toString();

      badges = badges.split('{current_branch}').join(currentBranch);

      return badges;
    },
    DEPSBADGES(_content, options) {
      const targets = options.deps.split('+');
      const pkgPath = path.resolve(process.cwd(), 'package.json');
      const pkg = require(pkgPath);
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };

      let badges = '';

      targets.forEach(dep => {
        badges += `![${dep}: ${
          deps[dep]
        }](https://img.shields.io/badge/${encodeURIComponent(dep).replace(
          '-',
          '--'
        )}-${deps[dep].slice(1)}-brightgreen)\n`;
      });

      return badges;
    }
  },
  callback: () => {
    console.log('Markup updated - building README...');
    markdownInclude.compileFiles('./docs/markdown.json').then(() => {
      console.log('README created!');
      console.log('Removing comments...');
      const removeComments = / *?\<\!-- ([\s\S]*?) ?--\>\n\n*?/g;
      const readmePath = path.resolve('./README.md');
      const file = fs.readFileSync(readmePath, 'utf-8');

      const updatedReadme = file.replace(removeComments, '');
      fs.writeFileSync(readmePath, updatedReadme);

      console.log('README updated');
    });
  }
};
