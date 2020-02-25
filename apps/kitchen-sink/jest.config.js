module.exports = {
  name: 'kitchen-sink',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/kitchen-sink',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
