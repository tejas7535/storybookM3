/* eslint-disable unicorn/no-null */
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { CalculationParametersOperationConditions } from '@ea/core/store/models';
import { addValidators, removeValidators } from '@ea/shared/helper';

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
      CalculationParametersOperationConditions['rotation']['typeOfMotion']
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
