module.exports = {
  name: 'kitchen-sink',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/kitchen-sink',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
