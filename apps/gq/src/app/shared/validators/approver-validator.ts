import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { Approver } from '../models/quotation/approver.model';

export function approverValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | undefined => {
    const { value } = control;

    const valid = !value || (value as Approver)?.userId;

    return !valid ? { invalidApprover: true } : undefined;
  };
}
