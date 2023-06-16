import { CommonModule } from '@angular/common';
import { Component, Input, Optional, Self } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroupDirective,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { NOOP_VALUE_ACCESSOR } from '../constants/input';
import { InfoButtonComponent } from '../info-button/info-button.component';

@Component({
  selector: 'ea-input-select',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    InfoButtonComponent,
    SharedTranslocoModule,
  ],
  templateUrl: './input-select.component.html',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class InputSelectComponent<TValue = unknown> {
  @Input() formControl: FormControl<TValue> | undefined;

  @Input() options: { label: string; value: TValue }[];
  @Input() label: string | undefined;
  @Input() placeholder: string | undefined;
  @Input() tooltip: string | undefined;

  constructor(@Self() @Optional() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = NOOP_VALUE_ACCESSOR;
    }
  }

  get control(): FormControl {
    return this.formControl || (this.ngControl?.control as FormControl);
  }
}
