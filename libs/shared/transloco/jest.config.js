module.exports = {
  name: 'shared-transloco',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/shared/transloco',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
