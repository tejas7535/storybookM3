import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  defaultMonthlyPeriodTypeOption,
  defaultPeriodTypes,
} from '../../../../../feature/demand-validation/time-range';
import { SelectableValue } from '../../../../../shared/components/inputs/autocomplete/selectable-values.utils';
import { DemandValidationDatePickerComponent } from '../../demand-validation-date-picker/demand-validation-date-picker.component';

@Component({
  selector: 'd360-date-picker-setting-demand-validation-modal',
  standalone: true,
  imports: [
    CommonModule,
    SharedTranslocoModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    DemandValidationDatePickerComponent,
  ],
  templateUrl: './date-picker-setting-demand-validation-modal.component.html',
  styleUrl: './date-picker-setting-demand-validation-modal.component.scss',
})
export class DatePickerSettingDemandValidationModalComponent {
  private readonly dialogRef = inject(
    MatDialogRef<DatePickerSettingDemandValidationModalComponent>
  );

  protected readonly data = inject(MAT_DIALOG_DATA);

  public defaultPeriodTypes = defaultPeriodTypes;

  protected formGroup = new FormGroup(
    {
      startDatePeriod1: new FormControl<Date>(this.data.range1.from),
      endDatePeriod1: new FormControl<Date>(this.data.range1.to),
      periodType1: new FormControl<SelectableValue>(
        this.defaultPeriodTypes.find(
          (pt) => pt.id === this.data.range1.period
        ) && defaultMonthlyPeriodTypeOption
      ),
      startDatePeriod2: new FormControl<Date>(this.data.range2?.from),
      endDatePeriod2: new FormControl<Date>(this.data.range2?.to),
      periodType2: new FormControl<SelectableValue>(
        this.defaultPeriodTypes.find(
          (pt) => pt.id === this.data.range2?.period
        ) && defaultMonthlyPeriodTypeOption
      ),
    },
    this.validatorFunction
  );

  private validatorFunction(): ValidatorFn {
    // TODO implement
    return null;
  }

  protected handleApplyDateRange() {
    // TODO implement
    if (this.formGroup.valid) {
      this.dialogRef.close({
        range1: {
          from: this.formGroup.controls.startDatePeriod1.getRawValue(),
          to: this.formGroup.controls.endDatePeriod1.getRawValue(),
          period: this.formGroup.controls.periodType1.getRawValue().id,
        },
        range2:
          this.formGroup.controls.periodType1.getRawValue().id === 'WEEKLY' &&
          this.formGroup.controls.endDatePeriod2.getRawValue()
            ? {
                from: this.formGroup.controls.startDatePeriod2.getRawValue(),
                to: this.formGroup.controls.endDatePeriod2.getRawValue(),
                period: this.formGroup.controls.periodType2.getRawValue().id,
              }
            : undefined,
      });
    }
  }

  protected handleOnClose() {
    // TODO implement
    this.dialogRef.close();
  }
}
