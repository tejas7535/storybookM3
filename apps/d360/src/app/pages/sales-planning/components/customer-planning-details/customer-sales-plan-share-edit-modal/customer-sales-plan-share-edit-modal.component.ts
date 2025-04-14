import {
  Component,
  DestroyRef,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
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
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

import { catchError, EMPTY, finalize, tap } from 'rxjs';

import { TranslocoDirective } from '@jsverse/transloco';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { DetailedCustomerSalesPlan } from '../../../../../feature/sales-planning/model';
import { SalesPlanningService } from '../../../../../feature/sales-planning/sales-planning.service';
import { ValidateForm } from '../../../../../shared/decorators';
import { NumberSeparatorDirective } from '../../../../../shared/directives';
import { getErrorMessage } from '../../../../../shared/utils/errors';
import { SnackbarService } from '../../../../../shared/utils/service/snackbar.service';
import { ValidationHelper } from '../../../../../shared/utils/validation/validation-helper';
import { sapMagicNumberValueNotConfigured } from '../column-definition';

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

  protected readonly totalExceedsLimit = 100;

  public readonly loading: WritableSignal<boolean> = signal<boolean>(false);

  protected readonly form = new FormGroup(
    {
      adjustedAPValue: new FormControl<number>(
        this.data.apShareAdjustedUnconstrained ===
        sapMagicNumberValueNotConfigured
          ? null
          : this.data.apShareAdjustedUnconstrained
      ),
      calculatedAPValue: new FormControl({
        value: this.data.apShareUnconstrained,
        disabled: true,
      }),
      adjustedOPValue: new FormControl<number>(
        this.data.opShareAdjustedUnconstrained ===
        sapMagicNumberValueNotConfigured
          ? null
          : this.data.opShareAdjustedUnconstrained
      ),
      calculatedOPValue: new FormControl({
        value: this.data.opShareUnconstrained,
        disabled: true,
      }),
      adjustedSPValue: new FormControl<number>(
        this.data.spShareAdjustedUnconstrained ===
        sapMagicNumberValueNotConfigured
          ? null
          : this.data.spShareAdjustedUnconstrained
      ),
      calculatedSPValue: new FormControl({
        value: this.data.spShareUnconstrained,
        disabled: true,
      }),
    },
    { validators: this.crossFieldValidator() }
  );

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

  @ValidateForm('form')
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

  private crossFieldValidator(): ValidatorFn {
    return (formGroup: AbstractControl) =>
      ValidationHelper.getCrossTotalExceedsLimit(
        formGroup as FormGroup,
        ['adjustedAPValue', 'adjustedOPValue', 'adjustedSPValue'],
        this.totalExceedsLimit
      );
  }
}
