import { CommonModule } from '@angular/common';
import { Component, input, OnInit, output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { KpiDateRanges } from '../../../../../feature/demand-validation/model';
import {
  defaultMonthlyPeriodTypeOption,
  defaultPeriodTypes,
} from '../../../../../feature/demand-validation/time-range';
import { SelectableValue } from '../../../../../shared/components/inputs/autocomplete/selectable-values.utils';
import { ValidateForm } from '../../../../../shared/decorators';
import { toNativeDate } from '../../../../../shared/utils/date-format';
import { ValidationHelper } from '../../../../../shared/utils/validation/validation-helper';
import { DemandValidationDatePickerComponent } from '../../demand-validation-date-picker/demand-validation-date-picker.component';

@Component({
  selector: 'd360-date-picker-setting-demand-validation-modal',
  standalone: true,
  imports: [
    CommonModule,
    SharedTranslocoModule,
    MatButton,
    DemandValidationDatePickerComponent,
  ],
  templateUrl: './date-picker-setting-demand-validation-modal.component.html',
})
export class DatePickerSettingDemandValidationModalComponent implements OnInit {
  public readonly data = input.required<KpiDateRanges>();
  public readonly close = input.required<() => void>();
  public selectionChange = output<KpiDateRanges>();

  public defaultPeriodTypes = defaultPeriodTypes;

  protected formGroup: FormGroup = null;

  public ngOnInit() {
    this.formGroup = new FormGroup(
      {
        startDatePeriod1: new FormControl(this.data().range1.from, {
          validators: Validators.required,
        }),
        endDatePeriod1: new FormControl(this.data().range1.to, {
          validators: Validators.required,
        }),
        periodType1: new FormControl<SelectableValue>(
          this.defaultPeriodTypes.find(
            (pt) => pt.id === this.data().range1.period
          ) || defaultMonthlyPeriodTypeOption,
          { validators: Validators.required }
        ),
        startDatePeriod2: new FormControl(this.data().range2?.from),
        endDatePeriod2: new FormControl(this.data().range2?.to),
        periodType2: new FormControl<SelectableValue>(
          this.defaultPeriodTypes.find(
            (pt) => pt.id === this.data().range2?.period
          ) || defaultMonthlyPeriodTypeOption
        ),
      },
      {
        validators: [
          this.crossFieldValidator('startDatePeriod1', 'endDatePeriod1'),
          this.crossFieldValidator('startDatePeriod2', 'endDatePeriod2'),
        ],
      }
    );
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

  @ValidateForm('formGroup')
  protected handleApplyDateRange() {
    if (this.formGroup.valid) {
      this.selectionChange.emit({
        range1: {
          from: toNativeDate(
            this.formGroup.controls.startDatePeriod1.getRawValue()
          ),
          to: toNativeDate(
            this.formGroup.controls.endDatePeriod1.getRawValue()
          ),
          period: this.formGroup.controls.periodType1.getRawValue().id,
        },
        range2:
          this.formGroup.controls.periodType1.getRawValue().id === 'WEEKLY' &&
          this.formGroup.controls.endDatePeriod2.getRawValue()
            ? {
                from: toNativeDate(
                  this.formGroup.controls.startDatePeriod2.getRawValue()
                ),
                to: toNativeDate(
                  this.formGroup.controls.endDatePeriod2.getRawValue()
                ),
                period: this.formGroup.controls.periodType2.getRawValue().id,
              }
            : undefined,
      });

      this.handleOnClose();
    }
  }

  protected handleOnClose() {
    this.close()();
  }
}
