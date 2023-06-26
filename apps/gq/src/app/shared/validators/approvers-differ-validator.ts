import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { Approver } from '../models';

export function approversDifferValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | undefined => {
    // when approver has been selected the value is of type Approver
    const firstApprover = (group.get('approver1').value as Approver)?.userId;
    const secondApprover = (group.get('approver2').value as Approver)?.userId;
    const thirdApprover = group.get('approver3')
      ? (group.get('approver3').value as Approver)?.userId
      : undefined;

    const approvers: string[] = [
      firstApprover,
      secondApprover,
      thirdApprover,
    ].filter((value) => !!value);

    // get all items of the approvers array that are unique
    const unique = [...new Set(approvers)];

    const valid = unique.length === approvers.length;

    return !valid ? { equalApprovers: true } : undefined;
  };
}
