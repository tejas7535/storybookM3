import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { FieldErrorComponent } from '../field-error/field-error.component';

const NULL_VALUE = '' as const;
type NULL_VALUE_TYPE = typeof NULL_VALUE;

export interface Option<T> {
  key: T | NULL_VALUE_TYPE;
  displayValue: string;
}

@Component({
  selector: 'd360-error-handling-select',
  standalone: true,
  imports: [MatSelectModule, ReactiveFormsModule, FieldErrorComponent],
  templateUrl: './error-handling-select.component.html',
})
export class ErrorHandlingSelectComponent {
  @Input({ required: true }) label!: string;
  @Input() appearance: MatFormFieldAppearance = 'outline';
  @Input() color: ThemePalette = 'primary';
  @Input() hint?: string;
  @Input() errorMessages: string[] = [];
  @Input() options!: Option<string>[];

  @Input({ required: true }) fC: FormControl<Option<string>>;
  @Input({ required: true }) fG: FormGroup;
}
