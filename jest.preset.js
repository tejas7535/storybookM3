const nxPreset = require('@nx/jest/preset').default;
module.exports = {
  ...nxPreset,
  cacheDirectory: process.env.MONO_AGENT
    ? '/home/adp-jenkins/temp/jest-cache'
    : '/tmp/jest_rs',
  coverageReporters: ['lcov', 'cobertura'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
  collectCoverage: true,
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'coverage/junit',
        outputName: `test-${Date.now()}.xml`,
      },
    ],
  ],
  /* TODO: Update to latest Jest snapshotFormat
   * By default Nx has kept the older style of Jest Snapshot formats
   * to prevent breaking of any existing tests with snapshots.
   * It's recommend you update to the latest format.
   * You can do this by removing snapshotFormat property
   * and running tests with --update-snapshot flag.
   * Example: "nx affected --targets=test --update-snapshot"
   * More info: https://jestjs.io/docs/upgrading-to-jest29#snapshot-format
   */
  snapshotFormat: { escapeString: true, printBasicPrototype: true },
};
