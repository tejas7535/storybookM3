module.exports = {
  name: 'shared-empty-states',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/shared/empty-states',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
