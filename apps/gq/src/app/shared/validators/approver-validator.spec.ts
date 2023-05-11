import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';

import { Approver } from '../models/quotation/approver.model';
import { approverValidator } from './approver-validator';

describe('approverValidator', () => {
  test('should return undefined when control is undefined', () => {
    const control: AbstractControl = new FormControl(undefined);
    const result = approverValidator()(control) as ValidationErrors | undefined;
    expect(result).toBeUndefined();
  });

  test('should return undefined when control has approver', () => {
    const control: AbstractControl = new FormControl({
      userId: 'id',
    } as Approver);
    const result = approverValidator()(control) as ValidationErrors | undefined;
    expect(result).toBeUndefined();
  });

  test('should return invalidApprover when control has empty approver', () => {
    const control: AbstractControl = new FormControl({} as Approver);
    const result = approverValidator()(control) as ValidationErrors | undefined;
    expect(result).toStrictEqual({ invalidApprover: true });
  });

  test('should return invalidApprover', () => {
    const control: AbstractControl = new FormControl('anyCrazyString');
    const result = approverValidator()(control) as ValidationErrors | undefined;
    expect(result).toStrictEqual({ invalidApprover: true });
  });
});
