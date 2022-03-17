import { FormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { ValidationUtils } from './validation-utils';

export class InputErrorStateMatcher implements ErrorStateMatcher {
  public isErrorState(control: FormControl | null): boolean {
    return ValidationUtils.isInputInvalid(control);
  }
}
