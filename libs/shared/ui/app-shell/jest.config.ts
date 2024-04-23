export default {
  displayName: 'app-shell',

  coverageDirectory: '../../../../coverage/libs/shared/ui/app-shell',

  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {},
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  transform: {
    '^.+.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  // support esm packages like flat in jest (see: https://github.com/jsverse/transloco/issues/704#issuecomment-1985754764 and https://angularexperts.io/blog/total-guide-to-jest-esm-and-angular and https://thymikee.github.io/jest-preset-angular/docs/guides/esm-support/)
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$|.pnpm|flat/)'],
  preset: '../../../../jest.preset.js',
};
