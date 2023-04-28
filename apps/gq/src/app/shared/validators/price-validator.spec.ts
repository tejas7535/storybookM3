import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';

import { LOCALE_DE } from '../constants';
import { priceValidator } from './price-validator';

describe('priceValidator', () => {
  test('should return undefined when value of control is undefined', () => {
    const control: AbstractControl = new FormControl(undefined);
    const result = priceValidator(expect.any(String))(control) as
      | ValidationErrors
      | undefined;
    expect(result).toBeUndefined();
  });
  test('should return invalidPrice when value is not a value of this currency (DE)', () => {
    const control: AbstractControl = new FormControl('12,453');
    const result = priceValidator(LOCALE_DE.id)(control) as
      | ValidationErrors
      | undefined;
    expect(result).toStrictEqual({ invalidPrice: true });
  });
  test('should return undefined when value is  a value of this currency (DE)', () => {
    const control: AbstractControl = new FormControl('12,45');
    const result = priceValidator(LOCALE_DE.id)(control) as
      | ValidationErrors
      | undefined;
    expect(result).toBeUndefined();
  });
});
