import { AbstractControl, FormControl } from '@angular/forms';

import { minLengthTrimmedValueValidator } from '@gq/shared/validators/min-length-trimmed-value.validator';

describe('minLengthTrimmedValueValidator', () => {
  test('should return null when value is valid', () => {
    const control: AbstractControl = new FormControl('019089295');
    const result = minLengthTrimmedValueValidator(9)(control);

    expect(result).toBeUndefined();
  });

  test('should return null when value with spaces is valid', () => {
    const control: AbstractControl = new FormControl('   019089295');
    const result = minLengthTrimmedValueValidator(9)(control);

    expect(result).toBeUndefined();
  });

  test('should return error when value with spaces has no min length', () => {
    const control: AbstractControl = new FormControl('     0190');
    const result = minLengthTrimmedValueValidator(9)(control);

    expect(result).toStrictEqual({
      minlength: { actualLength: 4, requiredLength: 9 },
    });
  });

  test('should return error when value with spaces is invalid', () => {
    const control: AbstractControl = new FormControl('0190     ');
    const result = minLengthTrimmedValueValidator(9)(control);

    expect(result).toStrictEqual({
      minlength: { actualLength: 4, requiredLength: 9 },
    });
  });
});
