import { UntypedFormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { ValidationUtils } from './validation-utils';

export class InputErrorStateMatcher implements ErrorStateMatcher {
  public isErrorState(control: UntypedFormControl | null): boolean {
    return ValidationUtils.isInputInvalid(control);
  }
}
