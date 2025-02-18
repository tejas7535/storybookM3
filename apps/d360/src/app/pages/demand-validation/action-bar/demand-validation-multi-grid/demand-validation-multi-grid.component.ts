import { Component, DestroyRef, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';

import { tap } from 'rxjs';

import { addYears, endOfMonth, endOfYear, startOfMonth } from 'date-fns';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MaterialType } from '../../../../feature/demand-validation/model';
import {
  defaultMonthlyPeriodTypeOption,
  defaultPeriodTypes,
} from '../../../../feature/demand-validation/time-range';
import { ValidateForm } from '../../../../shared/decorators';
import { toNativeDate } from '../../../../shared/utils/date-format';
import { ValidationHelper } from '../../../../shared/utils/validation/validation-helper';
import { DemandValidationDatePickerComponent } from '../demand-validation-date-picker/demand-validation-date-picker.component';
import { DemandValidationMultiGridEditComponent } from './demand-validation-multi-grid-edit/demand-validation-multi-grid-edit.component';

interface DemandValidationMultiListEditModalProps {
  customerName: string;
  customerNumber: string;
}

@Component({
  selector: 'd360-demand-validation-multi-grid-configuration-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    SharedTranslocoModule,
    MatButton,
    ReactiveFormsModule,
    MatRadioModule,
    DemandValidationDatePickerComponent,
  ],
  templateUrl: './demand-validation-multi-grid.component.html',
})
export class DemandValidationMultiGridComponent {
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogRef: MatDialogRef<DemandValidationMultiGridComponent> =
    inject(MatDialogRef<DemandValidationMultiGridComponent>);

  public customerName = input.required<string>();

  protected data: DemandValidationMultiListEditModalProps =
    inject(MAT_DIALOG_DATA);

  protected periodTypes = defaultPeriodTypes;

  protected formGroup = new FormGroup(
    {
      materialType: new FormControl<MaterialType>('schaeffler'),
      startDatePeriod1: new FormControl(
        startOfMonth(new Date()),
        Validators.required
      ),
      endDatePeriod1: new FormControl(
        endOfMonth(endOfYear(addYears(new Date(), 1))),
        Validators.required
      ),
      periodType1: new FormControl(
        defaultMonthlyPeriodTypeOption,
        Validators.required
      ),
      startDatePeriod2: new FormControl(),
      endDatePeriod2: new FormControl(),
      periodType2: new FormControl(defaultMonthlyPeriodTypeOption),
    },
    {
      validators: [
        this.crossFieldValidator('startDatePeriod1', 'endDatePeriod1'),
        this.crossFieldValidator('startDatePeriod2', 'endDatePeriod2'),
      ],
    }
  );

  @ValidateForm('formGroup')
  protected create() {
    if (this.formGroup.invalid) {
      return;
    }

    this.dialog
      .open(DemandValidationMultiGridEditComponent, {
        data: {
          customerName: this.data.customerName,
          customerNumber: this.data.customerNumber,
          materialType: this.formGroup.controls.materialType.getRawValue(),
          dateRange: {
            range1: {
              from: toNativeDate(
                this.formGroup.get('startDatePeriod1').getRawValue()
              ),
              to: toNativeDate(
                this.formGroup.get('endDatePeriod1').getRawValue()
              ),
              period: this.formGroup.get('periodType1').getRawValue()?.id,
            },
            range2: this.formGroup.get('endDatePeriod2').getRawValue()
              ? {
                  from: toNativeDate(
                    this.formGroup.get('startDatePeriod2').getRawValue()
                  ),
                  to: toNativeDate(
                    this.formGroup.get('endDatePeriod2').getRawValue()
                  ),
                  period: this.formGroup.get('periodType2').getRawValue()?.id,
                }
              : undefined,
          },
        },
        panelClass: ['form-dialog', 'demand-validation-multi-edit'],
        autoFocus: false,
        disableClose: true,
      })
      .afterClosed()
      .pipe(
        tap((reload: boolean) => this.dialogRef.close(reload)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private crossFieldValidator(
    startDateControlName: string,
    endDateControlName: string
  ): ValidatorFn {
    return (formGroup: AbstractControl) =>
      ValidationHelper.getStartEndDateValidationErrors(
        formGroup as FormGroup,
        true,
        startDateControlName,
        endDateControlName
      );
  }
}
