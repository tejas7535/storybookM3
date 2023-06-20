import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { ActiveDirectoryUser } from '../models';

export function userValidator(): ValidatorFn {
  return (
    control: AbstractControl<ActiveDirectoryUser>
  ): ValidationErrors | undefined => {
    const { value } = control;
    const valid = !value || value?.userId;

    return !valid ? { invalidUser: true } : undefined;
  };
}
