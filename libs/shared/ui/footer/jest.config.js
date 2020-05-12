module.exports = {
  name: 'shared-ui-footer',
  preset: '../../../../jest.config.js',
  coverageDirectory: '../../../../coverage/libs/shared/ui/footer',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
