import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { viscosityTable } from './viscosity-table';

// Constants for Viscosity Index calculation formulas
const VI_CALCULATION_CONSTANTS = {
  // Minimum valid v100 value
  MIN_V100_VALUE: 2,
  MIN_VALID_V100_VALUE: 3,
  // Threshold for using formula vs table lookup
  V100_FORMULA_THRESHOLD: 70,
  // L formula coefficients for v100 > 70
  L_FORMULA: {
    QUADRATIC_COEFF: 0.8353,
    LINEAR_COEFF: 14.67,
    CONSTANT: -216,
  },
  // H formula coefficients for v100 > 70
  H_FORMULA: {
    QUADRATIC_COEFF: 0.1684,
    LINEAR_COEFF: 11.85,
    CONSTANT: -97,
  },
  // VI calculation constants
  VI_BASE_VALUE: 100,
  VI_HIGH_MULTIPLIER: 0.007_15,
} as const;

function relativeValidatorFactory(
  relativeControl: FormControl,
  comparison: '>' | '<'
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (comparison === '<' && control.value >= relativeControl.value) {
      return { relativeValidatorError: true };
    }
    if (comparison === '>' && control.value <= relativeControl.value) {
      return { relativeValidatorError: true };
    }

    // eslint-disable-next-line unicorn/no-null
    return null;
  };
}
@Component({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormField,
    MatInputModule,
    MatError,
    MatCardModule,
    MatButtonModule,
    SharedTranslocoModule,
    MatDialogModule,
    MatIconModule,
  ],
  templateUrl: './vi-calculator.component.html',
})
export class ViCalculatorComponent implements OnInit, OnDestroy {
  public readonly dialogRef: MatDialogRef<ViCalculatorComponent> =
    inject(MatDialogRef);

  viWert: number | undefined = undefined;
  formSubmitted = false;

  v40 = new FormControl<number>(undefined, Validators.required);
  v100 = new FormControl<number>(undefined, [
    Validators.required,
    Validators.min(VI_CALCULATION_CONSTANTS.MIN_VALID_V100_VALUE),
  ]);
  viForm: FormGroup = new FormGroup({ v40: this.v40, v100: this.v100 });

  private readonly destroy$ = new Subject<void>();

  ngOnInit() {
    this.v40.addValidators(relativeValidatorFactory(this.v100, '>'));
    this.v100.addValidators(relativeValidatorFactory(this.v40, '<'));

    this.viForm.valueChanges
      .pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe(() => {
        this.calculateVI();
      });

    this.v40.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.viForm.updateValueAndValidity();
      this.v100.updateValueAndValidity({ emitEvent: false });
    });

    this.v100.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.viForm.updateValueAndValidity();
      this.v40.updateValueAndValidity({ emitEvent: false });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    this.formSubmitted = true;
    this.calculateVI();
  }

  calculateVI(): void {
    this.formSubmitted = true;

    if (!this.viForm || this.viForm.invalid) {
      this.viWert = undefined;

      return;
    }

    // v40: kinematic viscosity of the lubricant at 40°C
    const v40 = this.viForm.value.v40;
    // v100: kinematic viscosity of the lubricant at 100°C
    const v100 = this.viForm.value.v100;
    this.viWert = this.calculateVIFormula(v40, v100);
  }

  calculateVIFormula(v40: number, v100: number): number {
    if (!v40 || !v100 || v40 <= 0 || v100 <= 0) {
      return Number.NaN;
    }

    let L: number;
    let H: number;
    if (v100 <= VI_CALCULATION_CONSTANTS.MIN_V100_VALUE) {
      return Number.NaN;
    }

    if (v100 > VI_CALCULATION_CONSTANTS.V100_FORMULA_THRESHOLD) {
      L =
        VI_CALCULATION_CONSTANTS.L_FORMULA.QUADRATIC_COEFF * Math.pow(v100, 2) +
        VI_CALCULATION_CONSTANTS.L_FORMULA.LINEAR_COEFF * v100 +
        VI_CALCULATION_CONSTANTS.L_FORMULA.CONSTANT;
      H =
        VI_CALCULATION_CONSTANTS.H_FORMULA.QUADRATIC_COEFF * Math.pow(v100, 2) +
        VI_CALCULATION_CONSTANTS.H_FORMULA.LINEAR_COEFF * v100 +
        VI_CALCULATION_CONSTANTS.H_FORMULA.CONSTANT;
    } else {
      const row = viscosityTable.find((r) => r.v100 === Number(v100));
      if (!row) {
        return Number.NaN;
      }
      L = row.L;
      H = row.H;
    }

    if (v40 > H) {
      const VI = VI_CALCULATION_CONSTANTS.VI_BASE_VALUE * ((L - v40) / (L - H));

      return Math.round(VI);
    } else {
      const N = (Math.log(H) - Math.log(v40)) / Math.log(v100);
      const VI =
        VI_CALCULATION_CONSTANTS.VI_BASE_VALUE +
        (Math.pow(10, N) - 1) / VI_CALCULATION_CONSTANTS.VI_HIGH_MULTIPLIER;

      return Math.round(VI);
    }
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}
