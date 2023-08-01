import { FormArray, FormGroup, ValidationErrors } from '@angular/forms';

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
