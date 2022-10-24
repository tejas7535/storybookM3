import { Directive } from '@angular/core';
import {
  NG_VALIDATORS,
  UntypedFormControl,
  ValidationErrors,
  Validator,
} from '@angular/forms';

import { translate } from '@ngneat/transloco';

import { ValidationUtils } from './validation-utils';

@Directive({
  selector: '[iaValidInput]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: InputValidatorDirective,
      multi: true,
    },
  ],
})
export class InputValidatorDirective implements Validator {
  public validate(control: UntypedFormControl): ValidationErrors | null {
    let message: string;

    if (
      ValidationUtils.isInitialEmptyState(control) ||
      ValidationUtils.isInputTooShort(control)
    ) {
      message = 'filters.invalidInputTooShortHint';
    } else if (ValidationUtils.isInputValueFromTyping(control)) {
      message = 'filters.invalidInputDropdownHint';
    }

    return message ? { invalidInput: translate(message) } : undefined;
  }
}
