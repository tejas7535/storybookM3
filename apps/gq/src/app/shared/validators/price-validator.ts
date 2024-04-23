import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { getCurrencyRegex } from '../constants';

export function priceValidator(locale: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | undefined => {
    const { value } = control;

    const valid = !value || getCurrencyRegex(locale).test(value);

    return valid ? undefined : { invalidPrice: true };
  };
}
