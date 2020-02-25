module.exports = {
  name: 'shared-responsive',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/shared/responsive',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
