module.exports = {
  name: 'shared-responsive',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/shared/responsive',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
