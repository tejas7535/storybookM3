var markdownInclude = require('markdown-include');
var path = require('path');
var fs = require('fs');
const newLine = '\n';
const versionBadge = require('markdown-magic-version-badge');
module.exports = {
  transforms: {
    VERSIONBADGE(_content, options, config) {
      const badge = versionBadge(_content, options, config);
      return `${newLine}${badge}${newLine}`;
    },
    DEPSBADGES(_content, options) {
      const targets = options.deps.split('+');
      const pkgPath = path.resolve(process.cwd(), 'package.json');
      const pkg = require(pkgPath);
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      const duplicateMinus = (value) => !!value && value.replace('-', '--');
      const badges = targets
        .map((dep) => {
          return `![${dep}: ${
            deps[dep]
          }](https://img.shields.io/badge/${encodeURIComponent(
            duplicateMinus(dep)
          )}-${duplicateMinus(deps[dep])}-brightgreen)`;
        })
        .join('\n');
      return `${newLine}${badges}${newLine}`;
    },
  },
  callback: () => {
    console.log('Markup updated - building README...');
    markdownInclude.compileFiles('./docs/markdown.json').then(() => {
      console.log('README created!');
      console.log('Removing comments...');
      const removeStartComments =
        / *?\n?\<\!-- (AUTO-GENERATED-CONTENT:START)([\s\S]*?) ?--\>\n/g;
      const removeEndComments =
        /\n\n\<\!--.*(AUTO-GENERATED-CONTENT:END).*--\>/g;
      const readmePath = path.resolve('./README.md');
      const file = fs.readFileSync(readmePath, 'utf-8');
      let updatedReadme = file.replace(removeStartComments, '');
      updatedReadme = updatedReadme.replace(removeEndComments, '');
      fs.writeFileSync(readmePath, updatedReadme);
      console.log('README updated');
    });
  },
};
