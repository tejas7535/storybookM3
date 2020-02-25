module.exports = {
  name: 'shared-transloco',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/shared/transloco',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
