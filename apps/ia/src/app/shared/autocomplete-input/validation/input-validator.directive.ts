import { Directive, Input } from '@angular/core';
import {
  FormControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

import { translate } from '@ngneat/transloco';

import { IdValue } from '../../models';
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
  @Input('iaValidInput') items: IdValue[];

  public validate(control: FormControl): ValidationErrors | null {
    return ValidationUtils.isInputInvalid(this.items, control)
      ? { invalidInput: translate('filters.invalidInputHint') }
      : undefined;
  }
}
