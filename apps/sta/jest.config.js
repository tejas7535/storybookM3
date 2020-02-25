module.exports = {
  name: 'sta',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/sta',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
