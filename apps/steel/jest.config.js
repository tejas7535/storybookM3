module.exports = {
  name: 'steel',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/steel',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
