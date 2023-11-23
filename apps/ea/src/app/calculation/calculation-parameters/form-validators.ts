/* eslint-disable unicorn/no-null */
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { CalculationParametersFormHelperService } from '@ea/core/services/calculation-parameters-form-helper.service';
import { LoadCaseData } from '@ea/core/store/models';
import { addValidators, removeValidators } from '@ea/shared/helper';

import { LoadCaseDataFormGroupModel } from './loadcase-data-form-group.interface';

export const anyLoadGroupValidator =
  () =>
  (control: AbstractControl): ValidationErrors | null => {
    const group = control as FormGroup;
    const { radialLoad, axialLoad } = group.value;
    const { axialLoad: axialLoadControl, radialLoad: radialLoadControl } =
      group.controls;

    const anyLoadApplied = radialLoad > 0 || axialLoad > 0;

    if (anyLoadApplied) {
      // remove required validator on other field
      if (radialLoad > 0) {
        removeValidators(axialLoadControl, loadValidators);
      } else {
        removeValidators(radialLoadControl, loadValidators);
      }
    } else {
      // set both fields as required
      addValidators(radialLoadControl, loadValidators);
      addValidators(axialLoadControl, loadValidators);
    }

    return null;
  };

export const rotationValidator =
  () =>
  (control: AbstractControl): ValidationErrors | null => {
    const group = control as FormGroup;

    const typeOfMotionControl = group.controls['typeOfMotion'] as FormControl<
      LoadCaseData['rotation']['typeOfMotion']
    >;

    const { rotationalSpeed, shiftFrequency, shiftAngle } = group.controls;

    if (typeOfMotionControl.value === 'LB_ROTATING') {
      addValidators(rotationalSpeed, [Validators.required]);
      removeValidators(shiftFrequency, [Validators.required]);
      removeValidators(shiftAngle, [Validators.required]);
    } else {
      removeValidators(rotationalSpeed, [Validators.required]);
      addValidators(shiftFrequency, [Validators.required]);
      addValidators(shiftAngle, [Validators.required]);
    }

    return null;
  };

const anyLoadValidator = (control: AbstractControl) => {
  const errors = Validators.required(control);
  if (errors && 'required' in errors) {
    return {
      anyLoad: true,
    };
  }

  return null;
};

export const loadValidators = [
  Validators.required,
  anyLoadValidator,
  Validators.min(0),
  Validators.max(1_000_000_000),
];

export const rotationalSpeedValidators = [
  Validators.required,
  Validators.min(0.001),
  Validators.max(1_000_000),
];

export const shiftFrequencyValidators = [
  Validators.required,
  Validators.min(0.001),
  Validators.max(1_000_000),
];

export const shiftAngleValidators = [
  Validators.required,
  Validators.min(0.001),
  Validators.max(10_000),
];

export const viscosityGroupValidators = (): ValidatorFn[] => [
  (control: AbstractControl): ValidationErrors | null => {
    const errorKey = 'viscosity';
    const { ny40, ny100 } = (control as FormGroup).controls;

    // ny40 must be greater than ny100
    if (ny40.value && ny100.value && ny40.value <= ny100.value) {
      if (!ny40.hasError(errorKey)) {
        ny40.setErrors({ [errorKey]: true });
      }
      if (!ny100.hasError(errorKey)) {
        ny100.setErrors({ [errorKey]: true });
      }
    } else {
      if (ny40.hasError(errorKey)) {
        ny40.setErrors(null);
      }
      if (ny100.hasError(errorKey)) {
        ny100.setErrors(null);
      }
    }

    return null;
  },
];

export const loadCasesOperatingTimeValidators = (
  calculationParametersFormHelperService: CalculationParametersFormHelperService
): ValidatorFn[] => [
  (control: AbstractControl): ValidationErrors | null => {
    const errorKey = 'operatingTimeValueTotal';
    const formGroups: FormGroup<LoadCaseDataFormGroupModel>[] = (
      control as FormArray<FormGroup<LoadCaseDataFormGroupModel>>
    ).controls;

    // do not add validation to the single load case scenario
    if (formGroups.length === 1) {
      const operatingTime: FormControl<LoadCaseData['operatingTime']> =
        formGroups[0].controls.operatingTime;

      removeValidators(operatingTime, [Validators.required]);

      return null;
    }

    const total =
      calculationParametersFormHelperService.getTotalOperatingTimeForLoadcases(
        formGroups
      );

    const requiredTotalValue = 100;

    for (const formGroup of formGroups) {
      const operatingTime: FormControl<LoadCaseData['operatingTime']> =
        formGroup.controls.operatingTime;
      addValidators(operatingTime, [Validators.required]);
      if (total > requiredTotalValue) {
        if (!operatingTime.hasError(errorKey)) {
          operatingTime.setErrors({ [errorKey]: true });
        }
      } else {
        if (operatingTime.hasError(errorKey)) {
          operatingTime.setErrors(null);
        }
      }
    }

    return null;
  },
];

export const relativeValidatorFactory = (
  compare: '>' | '<',
  relativeTo: AbstractControl,
  errorKey: string
): ValidatorFn => {
  const greaterThan = compare === '>';

  return (control: AbstractControl): ValidationErrors | null => {
    if (
      control.value === undefined ||
      control.value === null ||
      relativeTo.value === null ||
      relativeTo.value === undefined
    ) {
      return null;
    }

    if (!relativeTo.dirty) {
      relativeTo.markAsDirty();
    }

    if (
      !(
        (greaterThan && control.value > relativeTo.value) ||
        (!greaterThan && control.value < relativeTo.value)
      )
    ) {
      relativeTo.setErrors({ [errorKey]: true });

      return { [errorKey]: true };
    }

    relativeTo.setErrors(null);

    return null;
  };
};

export const increaseInOilTempValidators = [
  Validators.required,
  Validators.min(0),
  Validators.max(100),
];
