import { CommonModule } from '@angular/common';
import { Component, Input, Optional, Self } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroupDirective,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';

import { NOOP_VALUE_ACCESSOR } from '../constants/input';

@Component({
  selector: 'ea-radio-button',
  standalone: true,
  imports: [CommonModule, MatRadioModule, ReactiveFormsModule],
  templateUrl: './radio-button.component.html',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class RadioButtonComponent {
  @Input() label: string;
  @Input() value: string;
  @Input() isDisabled?: boolean | undefined;
  @Input() isSubOption = false;

  @Input() formControl: FormControl | undefined;

  constructor(@Self() @Optional() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = NOOP_VALUE_ACCESSOR;
    }
  }

  get control(): FormControl {
    return this.formControl || (this.ngControl?.control as FormControl);
  }

  get checked(): boolean {
    return this.control?.value === this.value;
  }

  get disabled(): boolean {
    return this.isDisabled ?? this.control?.disabled;
  }

  onChange() {
    if (!this.checked) {
      this.control?.setValue(this.value);
    }
  }
}
