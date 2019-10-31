module.exports = {
  name: 'shared-empty-states',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/shared/empty-states',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
