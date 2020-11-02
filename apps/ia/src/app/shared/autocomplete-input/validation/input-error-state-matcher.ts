import { FormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { IdValue } from '../../models';
import { ValidationUtils } from './validation-utils';

export class InputErrorStateMatcher implements ErrorStateMatcher {
  public constructor(public items: IdValue[]) {}

  public isErrorState(control: FormControl | null): boolean {
    return ValidationUtils.isInputInvalid(this.items, control);
  }
}
