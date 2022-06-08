import { UntypedFormControl } from '@angular/forms';

export const ValidationUtils = {
  isInputInvalid(control: UntypedFormControl): boolean {
    return !!(
      control &&
      (control.dirty || control.touched) &&
      (ValidationUtils.isInputValueFromTyping(control) ||
        ValidationUtils.isInitialEmptyState(control) ||
        ValidationUtils.isInputTooShort(control))
    );
  },

  isInputValueFromTyping(control: UntypedFormControl): boolean {
    // if a value is selected, then it is of type object
    return control.value === null || typeof control.value === 'string';
  },

  isInitialEmptyState(control: UntypedFormControl): boolean {
    // if nothing has ben selected yet and user focus/unfocus the input
    return typeof control.value === 'object' && control.value === null;
  },

  isInputTooShort(control: UntypedFormControl): boolean {
    return typeof control.value === 'string' && control.value.length <= 1;
  },
};
