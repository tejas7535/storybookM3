const nxPreset = require('@nrwl/jest/preset').default;
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
};
