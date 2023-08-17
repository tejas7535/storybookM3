import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

/**
 * Extracts all nested errors from a FormGroup recursively.
 * @param formGroup
 */
export const extractNestedErrors = (formGroup: FormGroup): ValidationErrors => {
  const result: ValidationErrors = {};
  Object.keys(formGroup.controls).forEach((key) => {
    const control = formGroup.controls[key];
    if (control instanceof FormGroup) {
      const nestedErrors = extractNestedErrors(control);
      if (nestedErrors && Object.keys(nestedErrors).length > 0) {
        result[key] = nestedErrors;
      }
    } else if (control instanceof FormArray) {
      result[key] = {};
      control.controls.forEach((arrayControl, index) => {
        if (arrayControl instanceof FormGroup) {
          const nestedErrors = extractNestedErrors(arrayControl);
          if (nestedErrors && Object.keys(nestedErrors).length > 0) {
            result[key][index] = nestedErrors;
          }
        } else {
          const errors = arrayControl.errors;
          if (errors && Object.keys(errors).length > 0) {
            result[key][index] = errors;
          }
        }
      });
    } else {
      const errors = control.errors;
      if (errors && Object.keys(errors).length > 0) {
        result[key] = errors;
      }
    }
  });

  return result;
};

/**
 * Helper function to set validators on control.
 * Will only add missing validators and only update validity if any changes were made.
 */
export const addValidators = (
  control: AbstractControl,
  validators: ValidatorFn[]
) => {
  // find missing validators on control
  const missingValidators = validators.filter(
    (validator) => !control.hasValidator(validator)
  );
  if (missingValidators.length === 0) {
    return;
  }

  control.addValidators(missingValidators);
  control.updateValueAndValidity();
};

/**
 * Helper function to remove validators from control
 * Will only remove validators currently present and update validity only if changes were made
 * @param control
 * @param validatorsToRemove
 * @returns
 */
export const removeValidators = (
  control: AbstractControl,
  validatorsToRemove: ValidatorFn[]
) => {
  const existingValidatorsToRemove = validatorsToRemove.filter((validator) =>
    control.hasValidator(validator)
  );

  if (existingValidatorsToRemove.length === 0) {
    return;
  }

  control.removeValidators(existingValidatorsToRemove);
  control.updateValueAndValidity();
};
