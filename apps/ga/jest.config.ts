export default {
  displayName: 'ga',

  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {},
  coverageDirectory: '../../coverage/apps/ga',
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 70,
      lines: 75,
    },
  },
  transform: {
    '^.+.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  setupFiles: ['jest-canvas-mock'],
  // support esm packages like flat in jest (see: https://github.com/jsverse/transloco/issues/704#issuecomment-1985754764 and https://angularexperts.io/blog/total-guide-to-jest-esm-and-angular and https://thymikee.github.io/jest-preset-angular/docs/guides/esm-support/)
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$|.pnpm|flat/)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  preset: '../../jest.preset.js',
};
