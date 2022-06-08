import { AbstractControl, UntypedFormControl } from '@angular/forms';

import { Observable } from 'rxjs';

export class CustomFormControl {
  key: string;
  name: string;
  disabled: Observable<boolean> | boolean;
  flexibleLabel?: () => string;
  formControl: UntypedFormControl;
  infoText?: string;

  constructor(object: any) {
    this.key = object.key;
    this.name = object.name;
    this.disabled = object.disabled;
    this.flexibleLabel = object.flexibleLabel;
    this.formControl = object.formControl;
    this.infoText = object.infoText;
  }
}

export interface InputCategory {
  name: string;
  description?: string;
  info?: string;
  controls: CustomFormControl[];
  alwaysVisible?: boolean;
}

export interface AbstractControlWarn extends AbstractControl {
  warnings?: any;
}
