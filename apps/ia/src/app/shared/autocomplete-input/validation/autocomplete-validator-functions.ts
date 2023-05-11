import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { translate } from '@ngneat/transloco';

import { ValidationUtils } from './validation-utils';

export function createAutocompleteInputValidator(
  dimensionName: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let message = '';

    if (
      ValidationUtils.isInitialEmptyState(control) ||
      ValidationUtils.isInputTooShort(control)
    ) {
      message = 'filters.invalidInputTooShortHint';
    } else if (ValidationUtils.isInputValueFromTyping(control)) {
      message = 'filters.invalidInputDropdownHint';
    }

    return message
      ? {
          invalidInput: translate(message, {
            dimensionName,
          }),
        }
      : undefined;
  };
}

export function createSelectInputValidator(dimensionName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let message = '';

    if (
      ValidationUtils.isInitialEmptyState(control) ||
      ValidationUtils.isInputValueFromTyping(control)
    ) {
      message = 'filters.invalidInputDropdownHint';
    }

    return message
      ? {
          invalidInput: translate(message, {
            dimensionName,
          }),
        }
      : undefined;
  };
}
