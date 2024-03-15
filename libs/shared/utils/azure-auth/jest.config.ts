import crypto from 'node:crypto';

export default {
  displayName: 'shared-utils-azure-auth',

  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: { crypto },
  coverageDirectory: '../../../../coverage/libs/shared/utils/azure-auth',
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
  transformIgnorePatterns: ['node_modules/(?!.*.mjs$)'],
  preset: '../../../../jest.preset.js',
};
