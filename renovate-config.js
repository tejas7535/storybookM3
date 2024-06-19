module.exports = {
  platform: 'github',
  repositories: ['Schaeffler-Group/frontend-schaeffler'],
  npmrc: 'registry=https://artifactory.schaeffler.com/artifactory/api/npm/npm/',
  allowPostUpgradeCommandTemplating: true,
  allowedPostUpgradeCommands: ['pnpm run generate-readme'],
};
