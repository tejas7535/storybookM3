import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';

import { finalize, Observable, tap } from 'rxjs';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { NumberSeparatorDirective } from '../../../../../shared/directives';
import { NumberWithoutFractionDigitsPipe } from '../../../../../shared/pipes/number-without-fraction-digits.pipe';
import { getNumberFromLocale } from '../../../../../shared/utils/number';

export interface CustomerSalesPlanNumberAndPercentageEditProps {
  title: string;
  planningCurrency: string;
  previousValue: number;
  formLabel: string;
  currentValueLabel: string;
  previousValueLabel: string;
  onSave: (newValue: number) => Observable<void>;
  onDelete: () => Observable<void>;
  inputValidatorFn: (value: number) => ValidationErrors | null;
  inputValidatorErrorMessage: string;
}

export enum AdjustmentOption {
  Absolute = 'ABSOLUTE',
  Relative = 'RELATIVE',
}

@Component({
  selector: 'd360-customer-sales-plan-number-and-percentage-edit-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    SharedTranslocoModule,
    MatRadioGroup,
    MatRadioButton,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatDialogTitle,
    NumberWithoutFractionDigitsPipe,
    MatHint,
    MatError,
    LoadingSpinnerModule,
    NumberSeparatorDirective,
  ],
  templateUrl:
    './customer-sales-plan-number-and-percentage-edit-modal.component.html',
  styleUrl:
    './customer-sales-plan-number-and-percentage-edit-modal.component.scss',
})
export class CustomerSalesPlanNumberAndPercentageEditModalComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly translocoLocaleService = inject(TranslocoLocaleService);
  private readonly dialogRef: MatDialogRef<CustomerSalesPlanNumberAndPercentageEditModalComponent> =
    inject(MatDialogRef);

  protected readonly AdjustmentOption = AdjustmentOption;

  public readonly data: CustomerSalesPlanNumberAndPercentageEditProps =
    inject(MAT_DIALOG_DATA);

  public readonly isEnteringRelativeValue = signal(false);
  public readonly configuredValue = signal<number | null>(null);
  public readonly loading = signal<boolean>(false);

  public readonly form = new FormGroup({
    adjustmentOption: new FormControl<AdjustmentOption>(
      AdjustmentOption.Absolute
    ),
    adjustedValue: new FormControl<string | null>(null, [
      this.validateInput.bind(this),
    ]),
  });

  private validateInput(control: AbstractControl): ValidationErrors | null {
    if ([null, ''].includes(control.value)) {
      return null;
    }

    this.updateAdjustedValue(control.value);

    return this.data.inputValidatorFn(this.configuredValue());
  }

  protected onDelete(): void {
    this.loading.set(true);

    this.data
      .onDelete()
      .pipe(
        tap(() => this.dialogRef.close(-1)),
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected onCancel(): void {
    this.dialogRef.close(null);
  }

  protected onSave() {
    this.form.markAllAsTouched();

    if (this.form.valid && this.form.controls.adjustedValue.value !== null) {
      this.loading.set(true);

      this.data
        .onSave(this.configuredValue())
        .pipe(
          tap(() => this.dialogRef.close(this.configuredValue())),
          finalize(() => this.loading.set(false)),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe();
    }
  }

  public onChangeAdjustmentOption() {
    this.form.controls.adjustedValue.setValue(null);
    this.isEnteringRelativeValue.set(
      this.form.controls.adjustmentOption.value === AdjustmentOption.Relative
    );
    this.configuredValue.set(null);
  }

  public onInput(_: Event) {
    const controlValue = this.form.controls.adjustedValue.value;

    if ([null, ''].includes(controlValue)) {
      return;
    }

    this.updateAdjustedValue(controlValue);
  }

  private updateAdjustedValue(rawControlValue: string) {
    const adjustedValue = getNumberFromLocale(
      rawControlValue,
      this.translocoLocaleService.getLocale()
    );

    if (!Number.isFinite(adjustedValue)) {
      return;
    }

    if (this.isEnteringRelativeValue()) {
      const previousValue = this.data.previousValue;

      if (!Number.isFinite(previousValue)) {
        return;
      }

      const absoluteChange = (adjustedValue * previousValue) / 100;

      this.configuredValue.set(Math.round(previousValue + absoluteChange));
    } else {
      this.configuredValue.set(adjustedValue);
    }
  }
}
