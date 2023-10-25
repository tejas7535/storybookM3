import { FormControl } from '@angular/forms';

import {
  sapMaterialsUploadDataOwnerValidator,
  sapMaterialsUploadFileValidator,
} from './sap-materials-upload-dialog.validator';

describe('sapMaterialsUploadDialogValidator', () => {
  describe('sapMaterialsUploadFileValidator', () => {
    test('should return undefined if file extension is XLSX', () => {
      const control = new FormControl(new File([''], 'test.xlsx'));
      const result = sapMaterialsUploadFileValidator()(control);

      expect(result).toBeUndefined();
    });

    test('should return undefined if file extension is XLS', () => {
      const control = new FormControl(new File([''], 'test.xls'));
      const result = sapMaterialsUploadFileValidator()(control);

      expect(result).toBeUndefined();
    });

    test('should return unsupportedFileFormat', () => {
      const control = new FormControl(new File([''], 'test.json'));
      const result = sapMaterialsUploadFileValidator()(control);

      expect(result).toStrictEqual({ unsupportedFileFormat: true });
    });
  });

  describe('sapMaterialsUploadDataOwnerValidator', () => {
    test('should return undefined if data owner is valid', () => {
      const control = new FormControl({
        title: 'Mustermann, Max AA/BB-2XY',
      });
      const result = sapMaterialsUploadDataOwnerValidator()(control);

      expect(result).toBeUndefined();
    });

    test('should return invalidDataOwnerFormat if data owner is not valid', () => {
      const control = new FormControl({
        title: 'Max Mustermann',
      });
      const result = sapMaterialsUploadDataOwnerValidator()(control);

      expect(result).toStrictEqual({ invalidDataOwnerFormat: true });
    });
  });
});
