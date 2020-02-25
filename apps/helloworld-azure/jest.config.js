module.exports = {
  name: 'helloworld-azure',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/helloworld-azure',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
