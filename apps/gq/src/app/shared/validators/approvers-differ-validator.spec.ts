import {
  AbstractControl,
  FormBuilder,
  FormControl,
  ValidationErrors,
} from '@angular/forms';

import { Approver } from '../models';
import { approversDifferValidator } from './approvers-differ-validator';

describe('ApproversDifferValidator', () => {
  const fromBuilder: FormBuilder = new FormBuilder();
  describe('should work with thirdApprover required true', () => {
    test('Should return null, when no approver is selected', () => {
      const formGroup: AbstractControl = fromBuilder.group({
        approver1: new FormControl(),
        approver2: new FormControl(),
        approver3: new FormControl(),
      });
      const result = approversDifferValidator()(formGroup) as
        | ValidationErrors
        | undefined;

      expect(result).toBeUndefined();
    });
    test('Should return null,when some strings are entered', () => {
      const formGroup: AbstractControl = fromBuilder.group({
        approver1: new FormControl('aString'),
        approver2: new FormControl('bString'),
        approver3: new FormControl(),
      });
      const result = approversDifferValidator()(formGroup) as
        | ValidationErrors
        | undefined;

      expect(result).toBeUndefined();
    });

    test('Should return null,when Approvers differ from each other', () => {
      const formGroup: AbstractControl = fromBuilder.group({
        approver1: new FormControl({ userId: '1' } as Approver),
        approver2: new FormControl({ userId: '2' } as Approver),
        approver3: new FormControl({ userId: '3' } as Approver),
      });
      const result = approversDifferValidator()(formGroup) as
        | ValidationErrors
        | undefined;

      expect(result).toBeUndefined();
    });
    test('Should return null,when Approvers differ from each other, but third approver is not set', () => {
      const formGroup: AbstractControl = fromBuilder.group({
        approver1: new FormControl({ userId: '1' } as Approver),
        approver2: new FormControl({ userId: '2' } as Approver),
        approver3: new FormControl(),
      });
      const result = approversDifferValidator()(formGroup) as
        | ValidationErrors
        | undefined;

      expect(result).toBeUndefined();
    });
    test('should return Error when 2 Approvers are equal', () => {
      const formGroup: AbstractControl = fromBuilder.group({
        approver1: new FormControl({ userId: '1' } as Approver),
        approver2: new FormControl({ userId: '1' } as Approver),
        approver3: new FormControl({ userId: '3' } as Approver),
      });
      const result = approversDifferValidator()(formGroup) as
        | ValidationErrors
        | undefined;

      expect(result).toStrictEqual({ equalApprovers: true });
    });
    test('should return Error when 2 Approvers are equal, and first not set', () => {
      const formGroup: AbstractControl = fromBuilder.group({
        approver1: new FormControl(),
        approver2: new FormControl({ userId: '3' } as Approver),
        approver3: new FormControl({ userId: '3' } as Approver),
      });
      const result = approversDifferValidator()(formGroup) as
        | ValidationErrors
        | undefined;

      expect(result).toStrictEqual({ equalApprovers: true });
    });
    test('should return Error when all Approvers are equal', () => {
      const formGroup: AbstractControl = fromBuilder.group({
        approver1: new FormControl({ userId: '3' } as Approver),
        approver2: new FormControl({ userId: '3' } as Approver),
        approver3: new FormControl({ userId: '3' } as Approver),
      });
      const result = approversDifferValidator()(formGroup) as
        | ValidationErrors
        | undefined;

      expect(result).toStrictEqual({ equalApprovers: true });
    });
  });

  describe('should work with thirdApprover required false', () => {
    test('Should return null, when no approver is selected', () => {
      const formGroup: AbstractControl = fromBuilder.group({
        approver1: new FormControl(),
        approver2: new FormControl(),
      });
      const result = approversDifferValidator()(formGroup) as
        | ValidationErrors
        | undefined;

      expect(result).toBeUndefined();
    });
    test('Should return null,when some strings are entered', () => {
      const formGroup: AbstractControl = fromBuilder.group({
        approver1: new FormControl('aString'),
        approver2: new FormControl('bString'),
      });
      const result = approversDifferValidator()(formGroup) as
        | ValidationErrors
        | undefined;

      expect(result).toBeUndefined();
    });

    test('Should return null,when Approvers differ from each other', () => {
      const formGroup: AbstractControl = fromBuilder.group({
        approver1: new FormControl({ userId: '1' } as Approver),
        approver2: new FormControl({ userId: '2' } as Approver),
      });
      const result = approversDifferValidator()(formGroup) as
        | ValidationErrors
        | undefined;

      expect(result).toBeUndefined();
    });
    test('Should return null,when approver2 is not set', () => {
      const formGroup: AbstractControl = fromBuilder.group({
        approver1: new FormControl({ userId: '1' } as Approver),
        approver2: new FormControl(),
      });
      const result = approversDifferValidator()(formGroup) as
        | ValidationErrors
        | undefined;

      expect(result).toBeUndefined();
    });
    test('should return Error when 2 Approvers are equal', () => {
      const formGroup: AbstractControl = fromBuilder.group({
        approver1: new FormControl({ userId: '1' } as Approver),
        approver2: new FormControl({ userId: '1' } as Approver),
      });
      const result = approversDifferValidator()(formGroup) as
        | ValidationErrors
        | undefined;

      expect(result).toStrictEqual({ equalApprovers: true });
    });
  });
});
