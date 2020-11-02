import { FormControl } from '@angular/forms';

import { IdValue } from '../../models';
import { ValidationUtils } from './validation-utils';

describe('ValidationUtils', () => {
  describe('isInputInvalid', () => {
    it('should return true if control dirty and items do not include value', () => {
      const control = new FormControl('xd');
      control.markAsDirty();
      const items = [
        new IdValue('one', 'One'),
        new IdValue('two', 'Two'),
        new IdValue('three', 'Three'),
      ];

      const result = ValidationUtils.isInputInvalid(items, control);

      expect(result).toBeTruthy();
    });

    it('should return true if control touched and items do not include value', () => {
      const control = new FormControl('xd');
      control.markAsTouched();
      const items = [
        new IdValue('one', 'One'),
        new IdValue('two', 'Two'),
        new IdValue('three', 'Three'),
      ];

      const result = ValidationUtils.isInputInvalid(items, control);

      expect(result).toBeTruthy();
    });

    it('should return false if control touched and items include value', () => {
      const control = new FormControl('Three');
      control.markAsTouched();
      const items = [
        new IdValue('one', 'One'),
        new IdValue('two', 'Two'),
        new IdValue('three', 'Three'),
      ];

      const result = ValidationUtils.isInputInvalid(items, control);

      expect(result).toBeFalsy();
    });

    it('should return false if control dirty and items include value', () => {
      const control = new FormControl('Three');
      control.markAsDirty();
      const items = [
        new IdValue('one', 'One'),
        new IdValue('two', 'Two'),
        new IdValue('three', 'Three'),
      ];

      const result = ValidationUtils.isInputInvalid(items, control);

      expect(result).toBeFalsy();
    });

    it('should return false if control undefined', () => {
      const control: any = new FormControl(undefined);

      const items = [
        new IdValue('one', 'One'),
        new IdValue('two', 'Two'),
        new IdValue('three', 'Three'),
      ];

      const result = ValidationUtils.isInputInvalid(items, control);

      expect(result).toBeFalsy();
    });
  });
});
