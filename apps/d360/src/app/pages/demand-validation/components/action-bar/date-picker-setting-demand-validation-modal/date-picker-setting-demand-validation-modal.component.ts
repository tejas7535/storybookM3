import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

import { translate } from '@jsverse/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { KpiDateRanges } from '../../../../../feature/demand-validation/model';
import { SelectableValue } from '../../../../../shared/components/inputs/autocomplete/selectable-values.utils';
import {
  DemandValidationDatePickerComponent,
  DemandValidationDatePickerFormControls,
} from '../../demand-validation-date-picker/demand-validation-date-picker.component';

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
  dateControls: DemandValidationDatePickerFormControls;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: KpiDateRanges,
    public dialogRef: MatDialogRef<DatePickerSettingDemandValidationModalComponent>
  ) {
    const formGroup = new FormGroup(
      {
        startDatePeriod1: new FormControl<Date>(this.data.range1.from),
        endDatePeriod1: new FormControl<Date>(this.data.range1.to),
        periodType1: new FormControl<SelectableValue>(
          this.periodTypes.find((pt) => pt.id === this.data.range1.period)
        ),
        startDatePeriod2: new FormControl<Date>(this.data.range2?.from),
        endDatePeriod2: new FormControl<Date>(this.data.range2?.to),
        periodType2: new FormControl<SelectableValue>(
          this.periodTypes.find((pt) => pt.id === this.data.range2?.period)
        ),
      },
      this.validatorFunction
    );
    this.dateControls = {
      formGroup,
      startDatePeriod1: formGroup.get('startDatePeriod1') as FormControl,
      endDatePeriod1: formGroup.get('endDatePeriod1') as FormControl,
      periodType1: formGroup.get('periodType1') as FormControl,
      startDatePeriod2: formGroup.get('startDatePeriod2') as FormControl,
      endDatePeriod2: formGroup.get('endDatePeriod2') as FormControl,
      periodType2: formGroup.get('periodType2') as FormControl,
    };
  }

  protected periodTypes: SelectableValue[] = [
    {
      id: 'WEEKLY',
      text: translate('validation_of_demand.date_picker.menu_item_week', {}),
    },
    {
      id: 'MONTHLY',
      text: translate('validation_of_demand.date_picker.menu_item_month', {}),
    },
  ];

  private validatorFunction(): ValidatorFn {
    // TODO implement
    return null;
  }

  handleApplyDateRange() {
    // TODO implement
    if (this.dateControls.formGroup.valid) {
      this.dialogRef.close({
        range1: {
          from: this.dateControls.startDatePeriod1.getRawValue(),
          to: this.dateControls.endDatePeriod1.getRawValue(),
          period: this.dateControls.periodType1.getRawValue().id,
        },
        range2:
          this.dateControls.periodType1.getRawValue().id === 'WEEKLY' &&
          this.dateControls.endDatePeriod2.getRawValue()
            ? {
                from: this.dateControls.startDatePeriod2.getRawValue(),
                to: this.dateControls.endDatePeriod2.getRawValue(),
                period: this.dateControls.periodType2.getRawValue().id,
              }
            : undefined,
      });
    }
  }

  handleOnClose() {
    // TODO implement
    this.dialogRef.close();
  }
}
