import { CommonModule } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { addMonths, startOfMonth } from 'date-fns';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  firstViewableDate,
  lastViewableDate,
} from '../../../../feature/demand-validation/limits';
import { DatePickerComponent } from '../../../../shared/components/date-picker/date-picker.component';
import { DatePickerMonthYearComponent } from '../../../../shared/components/date-picker-month-year/date-picker-month-year.component';
import { SelectableValue } from '../../../../shared/components/inputs/autocomplete/selectable-values.utils';
import { DisplayFunctions } from '../../../../shared/components/inputs/display-functions.utils';
import { FilterDropdownComponent } from '../../../../shared/components/inputs/filter-dropdown/filter-dropdown.component';
import { toNativeDate } from '../../../../shared/utils/date-format';

@Component({
  selector: 'd360-demand-validation-date-picker',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePickerComponent,
    FilterDropdownComponent,
    SharedTranslocoModule,
    DatePickerMonthYearComponent,
  ],
  templateUrl: './demand-validation-date-picker.component.html',
  styleUrl: './demand-validation-date-picker.component.scss',
})
export class DemandValidationDatePickerComponent implements OnInit {
  public formGroup = input.required<FormGroup>();
  public periodType1 = input.required<FormControl>();
  public periodType2 = input<FormControl>();
  public startDatePeriod1 = input.required<FormControl>();
  public startDatePeriod2 = input<FormControl>();
  public endDatePeriod1 = input.required<FormControl>();
  public endDatePeriod2 = input<FormControl>();
  public periodTypes = input.required<SelectableValue[]>();

  public minDate = input<Date>(firstViewableDate());
  public maxDate = input<Date>(lastViewableDate());
  public disableOptionalDate = input<boolean>(false);

  protected readonly DisplayFunctions = DisplayFunctions;
  protected readonly lastViewableDate = lastViewableDate;

  protected minDateEndDatePeriod1: Date;
  protected midDateEndDatePeriod2: Date;

  ngOnInit() {
    this.midDateEndDatePeriod2 = [undefined, null].includes(
      this.endDatePeriod2()?.getRawValue()
    )
      ? firstViewableDate()
      : startOfMonth(addMonths(toNativeDate(this.endDatePeriod1().value), 1));

    this.minDateEndDatePeriod1 = this.startDatePeriod1().getRawValue();
  }

  onPeriodTypeChange(event: SelectableValue) {
    if (event.id === 'WEEKLY' && !this.disableOptionalDate()) {
      this.endDatePeriod2().setValue(null);
      this.periodType2().disable({ emitEvent: false });
      this.startDatePeriod2().disable({ emitEvent: false });
    }
  }
}
