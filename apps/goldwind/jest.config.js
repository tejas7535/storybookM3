module.exports = {
  name: 'goldwind',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/goldwind',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
