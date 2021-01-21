const nxPreset = require('@nrwl/jest/preset');
module.exports = {
  ...nxPreset,
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
