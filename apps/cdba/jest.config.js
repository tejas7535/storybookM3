module.exports = {
  name: 'cdba',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/cdba',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
  setupFilesAfterEnv: ['./src/test-setup.ts'],
};
