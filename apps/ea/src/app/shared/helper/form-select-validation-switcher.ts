import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

/** Helper validator to enable or disabble nested form groups
 * based on the value of a given selection form control.
 * Assumes that the nested form groups are siblings of the selection form control.
 *
 * Attach this validator to the selection form control.
 */
export const FormSelectValidatorSwitcher =
  (): ValidatorFn =>
  (abstractControl: AbstractControl): ValidationErrors | undefined => {
    const formGroup = abstractControl?.parent as FormGroup;

    if (!formGroup) {
      return undefined;
    }
    const selectionFormControl = abstractControl as FormControl;
    const selectionValue = selectionFormControl.value;

    // don't do anything if the form group is disabled
    if (formGroup.disabled) {
      return undefined;
    }

    for (const [key, control] of Object.entries(formGroup.controls)) {
      // skip selection control itself
      if (control === selectionFormControl) {
        continue;
      }

      // skip controls that are not form groups
      if (!(control instanceof FormGroup)) {
        continue;
      }

      // check if current form group is selected
      const isSelected = key === selectionValue;

      if (isSelected && !control.enabled) {
        control.enable({ emitEvent: false });
      } else if (!isSelected && control.enabled) {
        control.disable({ emitEvent: false });
      }
    }

    return undefined;
  };

export const FormGroupDisabledValidator =
  () =>
  (abstractControl: AbstractControl): ValidationErrors | undefined => {
    if (!abstractControl.disabled) {
      abstractControl.disable();
    }

    return undefined;
  };
