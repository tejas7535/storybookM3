import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Validate minimum length of a trimmed value.
 *
 * @param requiredLength required value length
 * @returns an validation error object or undefined
 */
export function minLengthTrimmedValueValidator(requiredLength: number) {
  return (control: AbstractControl): ValidationErrors | undefined => {
    const actualLength = control.value.trim().length;
    if (actualLength < requiredLength) {
      return { minlength: { actualLength, requiredLength } };
    }

    return undefined;
  };
}
