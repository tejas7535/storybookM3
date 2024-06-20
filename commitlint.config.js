const { getProjects } = require('@nx/devkit');
const { FsTree } = require('nx/src/generators/tree');

const Configuration = {
  extends: ['@commitlint/config-conventional'],
  utils: { getProjectScopes },
  rules: {
    'scope-enum': (ctx) =>
      getProjectScopes(ctx).then((packages) => [2, 'always', packages]),
  },
};

const nonNxProjectScopes = ['deps', 'jenkinsfile', 'workspace', 'docs'];

function getProjectScopes(context) {
  return Promise.resolve()
    .then(() => {
      const ctx = context || {};
      const cwd = ctx.cwd || process.cwd();

      const tree = new FsTree(cwd, false);
      const projects = getProjects(tree);

      return Array.from(projects.values() || []);
    })
    .then((projects) => {
      return projects
        .map((project) => project.name)
        .map((name) =>
          name
            .replaceAll('shared-', '')
            .replaceAll('utils-', '')
            .replaceAll('ui-', '')
        )
        .concat(nonNxProjectScopes);
    });
}

module.exports = Configuration;
