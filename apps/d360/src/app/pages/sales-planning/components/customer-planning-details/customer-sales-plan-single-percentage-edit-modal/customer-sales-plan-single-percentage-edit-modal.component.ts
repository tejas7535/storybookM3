import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
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
  previousReferenceValueLabel: number;
  referenceValue: number;
  previousReferenceValue: number;
  onSave: (newValue: number) => Observable<void>;
  onDelete: () => Observable<void>;
}

@Component({
  selector: 'd360-customer-sales-plan-single-percentage-edit-modal',
  standalone: true,
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
    MatError,
    LoadingSpinnerModule,
    NumberSeparatorDirective,
  ],
  templateUrl:
    './customer-sales-plan-single-percentage-edit-modal.component.html',
  styleUrl: './customer-sales-plan-single-percentage-edit-modal.component.scss',
})
export class CustomerSalesPlanSinglePercentageEditModalComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly translocoLocaleService = inject(TranslocoLocaleService);
  private readonly dialogRef: MatDialogRef<CustomerSalesPlanSinglePercentageEditModalComponent> =
    inject(MatDialogRef);

  public readonly data: CustomerSalesPlanNumberEditModalProps =
    inject(MAT_DIALOG_DATA);

  public readonly isEnteringRelativeValue = signal(false);
  public readonly adjustedPercentage = signal<number | null>(null);
  public readonly calculatedReferenceValue = signal<number | null>(null);
  public readonly loading = signal<boolean>(false);

  public readonly form = new FormGroup({
    adjustedPercentage: new FormControl<string | null>(null, [
      Validators.required,
      this.validateInput.bind(this),
    ]),
  });

  private validateInput(control: AbstractControl): ValidationErrors | null {
    if ([null, ''].includes(control.value)) {
      return null;
    }

    this.updatePercentageValue(control.value);

    const adjustedPercentageToBeValidated = this.adjustedPercentage();

    if (adjustedPercentageToBeValidated > 100) {
      return { max: { max: 100, actual: adjustedPercentageToBeValidated } };
    }

    if (adjustedPercentageToBeValidated < 0) {
      return { min: { min: 0, actual: adjustedPercentageToBeValidated } };
    }

    return null;
  }

  protected onDelete(): void {
    this.loading.set(true);

    this.data
      .onDelete()
      .pipe(
        tap(() => this.dialogRef.close(0)),
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

    if (
      this.form.valid &&
      this.form.controls.adjustedPercentage.value !== null
    ) {
      this.loading.set(true);

      this.data
        .onSave(this.adjustedPercentage())
        .pipe(
          tap(() => this.dialogRef.close(this.adjustedPercentage())),
          finalize(() => this.loading.set(false)),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe();
    }
  }

  public onInput(_: Event) {
    const controlValue = this.form.controls.adjustedPercentage.value;

    if ([null, ''].includes(controlValue)) {
      return;
    }

    this.updatePercentageValue(controlValue);
  }

  private updatePercentageValue(rawControlValue: string) {
    const adjustedPercentage = getNumberFromLocale(
      rawControlValue,
      this.translocoLocaleService.getLocale()
    );

    if (!Number.isFinite(adjustedPercentage)) {
      return;
    }

    const absoluteNewReferenceValue =
      this.data.referenceValue * (1 - adjustedPercentage / 100);

    this.calculatedReferenceValue.set(Math.round(absoluteNewReferenceValue));
    this.adjustedPercentage.set(adjustedPercentage);
  }
}
