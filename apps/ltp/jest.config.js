module.exports = {
  name: 'ltp',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/ltp',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
