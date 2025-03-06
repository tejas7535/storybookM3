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
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

import { finalize, Observable, tap } from 'rxjs';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { NumberSeparatorDirective } from '../../../../../shared/directives';
import { NumberWithoutFractionDigitsPipe } from '../../../../../shared/pipes/number-without-fraction-digits.pipe';
import { getNumberFromLocale } from '../../../../../shared/utils/number';

export interface CustomerSalesPlanNumberEditModalProps {
  title: string;
  planningCurrency: string;
  previousValue: number;
  formLabel: string;
  currentValueLabel: string;
  previousValueLabel: string;
  referenceValueLabel: string;
  previousReferenceValueLabel: string;
  referenceValue: number;
  previousReferenceValue: number;
  calculateReferenceValue: (newValue: number) => number;
  onSave: (newValue: number) => Observable<void>;
  onDelete: () => Observable<void>;
}

@Component({
  selector: 'd360-customer-sales-plan-number-edit-modal',
  imports: [
    CommonModule,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    SharedTranslocoModule,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatDialogTitle,
    NumberWithoutFractionDigitsPipe,
    LoadingSpinnerModule,
    NumberSeparatorDirective,
    MatError,
  ],
  templateUrl: './customer-sales-plan-number-edit-modal.component.html',
  styleUrl: './customer-sales-plan-number-edit-modal.component.scss',
})
export class CustomerSalesPlanNumberEditModalComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly translocoLocaleService = inject(TranslocoLocaleService);
  private readonly dialogRef: MatDialogRef<CustomerSalesPlanNumberEditModalComponent> =
    inject(MatDialogRef);

  public readonly data: CustomerSalesPlanNumberEditModalProps =
    inject(MAT_DIALOG_DATA);

  public readonly configuredValue = signal<number | null>(null);
  public readonly calculatedReferenceValue = signal<number | null>(null);
  public readonly loading = signal<boolean>(false);

  public readonly form = new FormGroup({
    adjustedValue: new FormControl<string | null>(null, [
      this.validateInput.bind(this),
    ]),
  });

  private validateInput(control: AbstractControl): ValidationErrors | null {
    if ([null, ''].includes(control.value)) {
      return null;
    }

    this.updateAdjustedValue(control.value);

    const adjustedNumberToBeValidated = this.configuredValue();

    if (adjustedNumberToBeValidated < 0) {
      return { min: { min: 0, actual: adjustedNumberToBeValidated } };
    }

    return null;
  }

  public onDelete(): void {
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

  public onCancel(): void {
    this.dialogRef.close(null);
  }

  public onSave() {
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

    this.configuredValue.set(adjustedValue);

    this.calculatedReferenceValue.set(
      this.data.calculateReferenceValue(adjustedValue)
    );
  }
}
