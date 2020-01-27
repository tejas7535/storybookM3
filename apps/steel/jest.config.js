module.exports = {
  name: 'steel',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/steel',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
