export default {
  displayName: 'd360',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../../coverage/apps/d360',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  resetMocks: true,
  restoreMocks: true,
  randomize: true,
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  // support esm packages like flat in jest (see: https://github.com/jsverse/transloco/issues/704#issuecomment-1985754764 and https://angularexperts.io/blog/total-guide-to-jest-esm-and-angular and https://thymikee.github.io/jest-preset-angular/docs/guides/esm-support/)
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$|.pnpm|flat/)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};
