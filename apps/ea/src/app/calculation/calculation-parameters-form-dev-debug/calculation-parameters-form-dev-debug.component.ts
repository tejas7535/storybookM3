import { CommonModule } from '@angular/common';
import { Component, Input, isDevMode } from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  templateUrl: './calculation-parameters-form-dev-debug.component.html',
  selector: 'ea-calculation-parameters-form-dev-debug',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSlideToggleModule],
})
export class CalculationParametersFormDevDebugComponent {
  @Input() operationConditionsForm: FormGroup;
  @Input() validationErrors: ValidationErrors;

  public readonly isDev = isDevMode();
}
