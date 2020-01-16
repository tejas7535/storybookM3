module.exports = {
  name: 'helloworld-azure',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/helloworld-azure',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
