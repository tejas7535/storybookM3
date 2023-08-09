import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function specialCharactersValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const specialCharacterPattern = /[/<>]/;
    const isInvalid = specialCharacterPattern.test(control.value);

    return isInvalid ? { invalidCharacters: true } : undefined;
  };
}
