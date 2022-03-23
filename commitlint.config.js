const { Workspaces } = require('@nrwl/tao/src/shared/workspace');

const Configuration = {
  extends: ['@commitlint/config-conventional'],
  utils: { getProjects },
  rules: {
    'scope-enum': (ctx) =>
      getProjects(ctx).then((packages) => [2, 'always', packages]),
  },
};

const nonNxProjectScopes = ['deps', 'jenkinsfile', 'workspace', 'docs'];

function getProjects(context) {
  return Promise.resolve()
    .then(() => {
      const ctx = context || {};
      const cwd = ctx.cwd || process.cwd();
      const ws = new Workspaces(cwd);
      const workspace = ws.readWorkspaceConfiguration();
      return Object.entries(workspace.projects || {}).map(
        ([name, project]) => ({
          name,
          ...project,
        })
      );
    })
    .then((projects) => {
      return projects
        .filter((project) => project.targets)
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
