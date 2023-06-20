import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';

import { userValidator } from './user-validator';

describe('userValidator', () => {
  test('should return undefined when control is undefined', () => {
    const control: AbstractControl = new FormControl(undefined);
    const result = userValidator()(control) as ValidationErrors | undefined;
    expect(result).toBeUndefined();
  });

  test('should return undefined when control has user', () => {
    const control: AbstractControl = new FormControl({
      userId: 'id',
    });
    const result = userValidator()(control) as ValidationErrors | undefined;
    expect(result).toBeUndefined();
  });

  test('should return invalidUser when control has empty user', () => {
    const control: AbstractControl = new FormControl({});
    const result = userValidator()(control) as ValidationErrors | undefined;
    expect(result).toStrictEqual({ invalidUser: true });
  });

  test('should return invalidUser', () => {
    const control: AbstractControl = new FormControl('anyCrazyString');
    const result = userValidator()(control) as ValidationErrors | undefined;
    expect(result).toStrictEqual({ invalidUser: true });
  });
});
