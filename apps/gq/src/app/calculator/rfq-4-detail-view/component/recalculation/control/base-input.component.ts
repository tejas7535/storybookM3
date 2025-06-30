import { Component, inject, input, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';

import { validateNumericInputKeyPress } from '@gq/shared/utils/misc.utils';

@Component({
  template: '',
})
export abstract class BaseInputComponent
  implements OnInit, ControlValueAccessor
{
  formControlName = input<string>();
  rootFormGroup = inject(FormGroupDirective);

  formControl: FormControl;
  form: FormGroup;

  ngOnInit(): void {
    this.form = this.rootFormGroup.control;
    this.formControl = this.rootFormGroup.control?.get(
      this.formControlName()
    ) as FormControl;
  }

  writeValue(_obj: any): void {}

  registerOnChange(_fn: any): void {}

  registerOnTouched(_fn: any): void {}

  setDisabledState?(_isDisabled: boolean): void {}

  validateNumericInputKeyPress(event: KeyboardEvent) {
    validateNumericInputKeyPress(event);
  }
}
