import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { ActiveDirectoryUser } from '../models';

export function autocompleteValueSelectedValidator(
  users: ActiveDirectoryUser[]
): ValidatorFn {
  return (
    control: AbstractControl<ActiveDirectoryUser>
  ): ValidationErrors | undefined => {
    const { value } = control;
    const valid = !value || users.includes(value);

    return !valid ? { invalidSelection: true } : undefined;
  };
}
