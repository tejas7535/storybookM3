/* eslint-disable unicorn/no-null */
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { CalculationParametersFormHelperService } from '@ea/core/services/calculation-parameters-form-helper.service';
import { LoadCaseData } from '@ea/core/store/models';

import {
  loadCasesOperatingTimeValidators,
  relativeValidatorFactory,
  viscosityGroupValidators,
} from './form-validators';
import { LoadCaseDataFormGroupModel } from './loadcase-data-form-group.interface';

describe('loadCasesOperatingTimeValidators', () => {
  let calculationParametersFormHelperService: CalculationParametersFormHelperService;

  beforeEach(() => {
    calculationParametersFormHelperService = {
      getTotalOperatingTimeForLoadcases: jest.fn(),
    } as unknown as CalculationParametersFormHelperService;
  });

  describe('viscosityGroupValidators', () => {
    it('should set error if ny40 is less than or equal to ny100', () => {
      const formGroup = new FormGroup({
        ny40: new FormControl(30),
        ny100: new FormControl(40),
      });

      const validators = viscosityGroupValidators();
      const validatorFn = validators[0];
      const result = validatorFn(formGroup);

      expect(result).toBeNull();
      expect(formGroup.controls.ny40.hasError('viscosity')).toBe(true);
      expect(formGroup.controls.ny100.hasError('viscosity')).toBe(true);
    });

    it('should clear error if ny40 is greater than ny100', () => {
      const formGroup = new FormGroup({
        ny40: new FormControl(50),
        ny100: new FormControl(40),
      });

      formGroup.controls.ny40.setErrors({ viscosity: true });
      formGroup.controls.ny100.setErrors({ viscosity: true });

      const validators = viscosityGroupValidators();
      const validatorFn = validators[0];
      const result = validatorFn(formGroup);

      expect(result).toBeNull();
      expect(formGroup.controls.ny40.hasError('viscosity')).toBe(false);
      expect(formGroup.controls.ny100.hasError('viscosity')).toBe(false);
    });

    it('should not set error if ny40 or ny100 is null or undefined', () => {
      const formGroup = new FormGroup({
        ny40: new FormControl(null),
        ny100: new FormControl(40),
      });

      const validators = viscosityGroupValidators();
      const validatorFn = validators[0];
      const result = validatorFn(formGroup);

      expect(result).toBeNull();
      expect(formGroup.controls.ny40.hasError('viscosity')).toBe(false);
      expect(formGroup.controls.ny100.hasError('viscosity')).toBe(false);

      formGroup.controls.ny40.setValue(50);
      formGroup.controls.ny100.setValue(null);
      const result2 = validatorFn(formGroup);

      expect(result2).toBeNull();
      expect(formGroup.controls.ny40.hasError('viscosity')).toBe(false);
      expect(formGroup.controls.ny100.hasError('viscosity')).toBe(false);
    });
  });

  it('should not add validation for a single load case', () => {
    const formGroup = new FormGroup<Partial<LoadCaseDataFormGroupModel>>({
      operatingTime: new FormControl<LoadCaseData['operatingTime']>(50),
    });
    const formArray = new FormArray([formGroup]);

    const validators = loadCasesOperatingTimeValidators(
      calculationParametersFormHelperService
    );
    const validatorFn = validators[0];
    const result = validatorFn(formArray);

    expect(result).toBeNull();
    expect(
      formGroup.controls.operatingTime.hasValidator(Validators.required)
    ).toBe(false);
  });

  it('should add validation and set error if total operating time exceeds required value', () => {
    const formGroup1 = new FormGroup<Partial<LoadCaseDataFormGroupModel>>({
      operatingTime: new FormControl<LoadCaseData['operatingTime']>(60),
    });
    const formGroup2 = new FormGroup<Partial<LoadCaseDataFormGroupModel>>({
      operatingTime: new FormControl<LoadCaseData['operatingTime']>(50),
    });
    const formArray = new FormArray([formGroup1, formGroup2]);

    calculationParametersFormHelperService.getTotalOperatingTimeForLoadcases =
      jest.fn().mockReturnValue(110);

    const validators = loadCasesOperatingTimeValidators(
      calculationParametersFormHelperService
    );
    const validatorFn = validators[0];
    const result = validatorFn(formArray);

    expect(result).toBeNull();
    expect(
      formGroup1.controls.operatingTime.hasError('operatingTimeValueTotal')
    ).toBe(true);
    expect(
      formGroup2.controls.operatingTime.hasError('operatingTimeValueTotal')
    ).toBe(true);
  });

  it('should clear error if total operating time does not exceed required value and errors were previously set', () => {
    const formGroup1 = new FormGroup<Partial<LoadCaseDataFormGroupModel>>({
      operatingTime: new FormControl<LoadCaseData['operatingTime']>(40),
    });
    const formGroup2 = new FormGroup<Partial<LoadCaseDataFormGroupModel>>({
      operatingTime: new FormControl<LoadCaseData['operatingTime']>(50),
    });
    const formArray = new FormArray([formGroup1, formGroup2]);

    calculationParametersFormHelperService.getTotalOperatingTimeForLoadcases =
      jest.fn().mockReturnValue(90);

    formGroup1.controls.operatingTime.setErrors({
      operatingTimeValueTotal: true,
    });
    formGroup2.controls.operatingTime.setErrors({
      operatingTimeValueTotal: true,
    });

    const validators = loadCasesOperatingTimeValidators(
      calculationParametersFormHelperService
    );
    const validatorFn = validators[0];
    const result = validatorFn(formArray);

    expect(result).toBeNull();
    expect(
      formGroup1.controls.operatingTime.hasError('operatingTimeValueTotal')
    ).toBe(false);
    expect(
      formGroup2.controls.operatingTime.hasError('operatingTimeValueTotal')
    ).toBe(false);
  });

  describe('relativeValidatorFactory', () => {
    it('should return null if control value or relativeTo value is undefined or null', () => {
      const relativeTo = new FormControl(null);
      const control = new FormControl(null);
      const validator = relativeValidatorFactory('>', relativeTo, 'errorKey');

      expect(validator(control)).toBeNull();

      control.setValue(10);
      expect(validator(control)).toBeNull();

      control.setValue(null);
      relativeTo.setValue(10);
      expect(validator(control)).toBeNull();
    });

    it('should mark relativeTo as dirty if it is not dirty', () => {
      const relativeTo = new FormControl(5);
      const control = new FormControl(10);
      const validator = relativeValidatorFactory('>', relativeTo, 'errorKey');

      expect(relativeTo.dirty).toBe(false);
      validator(control);
      expect(relativeTo.dirty).toBe(true);
    });

    it('should set error if control value is not greater than relativeTo value when compare is ">"', () => {
      const relativeTo = new FormControl(10);
      const control = new FormControl(5);
      const validator = relativeValidatorFactory('>', relativeTo, 'errorKey');

      const result = validator(control);
      expect(result).toEqual({ errorKey: true });
      expect(relativeTo.hasError('errorKey')).toBe(true);
    });

    it('should set error if control value is not less than relativeTo value when compare is "<"', () => {
      const relativeTo = new FormControl(5);
      const control = new FormControl(10);
      const validator = relativeValidatorFactory('<', relativeTo, 'errorKey');

      const result = validator(control);
      expect(result).toEqual({ errorKey: true });
      expect(relativeTo.hasError('errorKey')).toBe(true);
    });

    it('should clear error if control value is greater than relativeTo value when compare is ">"', () => {
      const relativeTo = new FormControl(5);
      const control = new FormControl(10);
      const validator = relativeValidatorFactory('>', relativeTo, 'errorKey');

      relativeTo.setErrors({ errorKey: true });
      const result = validator(control);
      expect(result).toBeNull();
      expect(relativeTo.hasError('errorKey')).toBe(false);
    });

    it('should clear error if control value is less than relativeTo value when compare is "<"', () => {
      const relativeTo = new FormControl(10);
      const control = new FormControl(5);
      const validator = relativeValidatorFactory('<', relativeTo, 'errorKey');

      relativeTo.setErrors({ errorKey: true });
      const result = validator(control);
      expect(result).toBeNull();
      expect(relativeTo.hasError('errorKey')).toBe(false);
    });
  });
});
