import { Injectable, OutputEmitterRef } from '@angular/core';
import { FormControl } from '@angular/forms';

import { BaseAutocompleteInputComponent } from './base-autocomplete-input.component';

@Injectable({
  providedIn: 'root',
})
export class MaterialAutocompleteUtilsService {
  public emitIsValidOnFormInput(
    value: string,
    isValid: OutputEmitterRef<boolean>,
    formControl: FormControl
  ) {
    if (value?.length <= BaseAutocompleteInputComponent.ONE_CHAR_LENGTH) {
      // emit for parent component  errorHandling such as disabling buttons
      isValid.emit(!formControl.hasError('invalidInput'));
    }
  }
}
