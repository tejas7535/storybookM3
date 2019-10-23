module.exports = {
  name: 'sta',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/sta',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
