module.exports = {
  name: 'seli',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/seli',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
