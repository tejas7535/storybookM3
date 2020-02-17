module.exports = {
  name: 'cdba',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/cdba',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
