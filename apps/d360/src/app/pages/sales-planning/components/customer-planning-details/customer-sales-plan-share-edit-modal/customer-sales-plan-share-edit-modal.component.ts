import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

import { catchError, EMPTY, finalize, tap } from 'rxjs';

import { TranslocoDirective } from '@jsverse/transloco';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { DetailedCustomerSalesPlan } from '../../../../../feature/sales-planning/model';
import { SalesPlanningService } from '../../../../../feature/sales-planning/sales-planning.service';
import { NumberSeparatorDirective } from '../../../../../shared/directives';
import { getErrorMessage } from '../../../../../shared/utils/errors';
import { SnackbarService } from '../../../../../shared/utils/service/snackbar.service';

export interface CustomerSalesPlanNumberEditModalProps {
  title: string;
  customerNumber: string;
  planningYear: string;
  currentApShare: number;
  currentOpShare: number;
  currentSpShare: number;
}

@Component({
  selector: 'd360-customer-sales-plan-share-edit-modal',
  imports: [
    MatDialogContent,
    MatError,
    MatFormFieldModule,
    MatInput,
    MatLabel,
    NumberSeparatorDirective,
    ReactiveFormsModule,
    TranslocoDirective,
    MatDialogTitle,
    MatButton,
    MatDialogActions,
    LoadingSpinnerModule,
  ],
  templateUrl: './customer-sales-plan-share-edit-modal.component.html',
  styleUrl: './customer-sales-plan-share-edit-modal.component.scss',
})
export class CustomerSalesPlanShareEditModalComponent {
  private readonly salesPlanningService: SalesPlanningService =
    inject(SalesPlanningService);
  private readonly dialogRef: MatDialogRef<CustomerSalesPlanShareEditModalComponent> =
    inject(MatDialogRef);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly snackbarService: SnackbarService = inject(SnackbarService);

  public readonly data: DetailedCustomerSalesPlan = inject(MAT_DIALOG_DATA);

  protected readonly form = new FormGroup({
    adjustedAPValue: new FormControl<number>(null),
    calculatedAPValue: new FormControl({
      value: this.data.apShareConstrained,
      disabled: true,
    }),
    adjustedOPValue: new FormControl<number>(null),
    calculatedOPValue: new FormControl({
      value: this.data.opShareConstrained,
      disabled: true,
    }),
    adjustedSPValue: new FormControl<number>(null),
    calculatedSPValue: new FormControl({
      value: this.data.spShareConstrained,
      disabled: true,
    }),
  });

  public readonly loading = signal<boolean>(false);

  protected onDelete() {
    this.loading.set(true);
    this.salesPlanningService
      .deleteShares(this.data.customerNumber, this.data.planningYear)
      .pipe(
        tap(() => this.dialogRef.close(true)),
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
  protected onSave() {
    if (this.form.valid) {
      this.loading.set(true);
      this.salesPlanningService
        .updateShares(this.data.customerNumber, this.data.planningYear, {
          apShare: this.form.controls.adjustedAPValue.value,
          spShare: this.form.controls.adjustedSPValue.value,
          opShare: this.form.controls.adjustedOPValue.value,
        })
        .pipe(
          catchError((error) => {
            this.snackbarService.openSnackBar(getErrorMessage(error));

            return EMPTY;
          }),
          tap(() => this.dialogRef.close(true)),
          finalize(() => this.loading.set(false)),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe();
    }
  }

  protected onCancel() {
    this.dialogRef.close(false);
  }
}
