module.exports = {
  name: 'ltp',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/ltp',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
