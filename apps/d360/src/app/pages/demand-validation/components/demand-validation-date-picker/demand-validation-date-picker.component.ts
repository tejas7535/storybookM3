import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { tap } from 'rxjs';

import { addMonths, endOfMonth, startOfMonth } from 'date-fns';
import { isMoment, Moment } from 'moment';

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
  private readonly destroyRef = inject(DestroyRef);

  public formGroup = input.required<FormGroup>();

  public periodType1 = input.required<FormControl>();
  public startDatePeriod1 = input.required<FormControl>();
  public endDatePeriod1 = input.required<FormControl>();

  public periodType2 = input<FormControl>();
  public startDatePeriod2 = input<FormControl>();
  public endDatePeriod2 = input<FormControl>();

  public periodTypes = input.required<SelectableValue[]>();
  public minDate = input<Date>(firstViewableDate());
  public maxDate = input<Date>(lastViewableDate());
  public disableOptionalDate = input<boolean>(false);

  protected readonly DisplayFunctions = DisplayFunctions;
  protected readonly lastViewableDate = lastViewableDate;

  protected minDateEndDatePeriod1: Date;
  protected midDateEndDatePeriod2: Date;

  public ngOnInit(): void {
    this.midDateEndDatePeriod2 = [undefined, null].includes(
      this.endDatePeriod2()?.getRawValue()
    )
      ? firstViewableDate()
      : startOfMonth(addMonths(toNativeDate(this.endDatePeriod1().value), 1));

    this.minDateEndDatePeriod1 = this.startDatePeriod1().getRawValue();

    this.endDatePeriod1()
      .valueChanges.pipe(
        tap(this._endDatePeriod1Change.bind(this)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected onPeriodTypeChange(event: SelectableValue): void {
    if (event.id === 'WEEKLY' && !this.disableOptionalDate()) {
      this._endDatePeriod1Change(this.endDatePeriod1().getRawValue());
      this.endDatePeriod2().setValue(null);
      this.periodType2().disable({ emitEvent: false });
      this.startDatePeriod2().disable({ emitEvent: false });
    }
  }

  private _endDatePeriod1Change(value: Moment | Date): void {
    const endDate = endOfMonth(isMoment(value) ? value.toDate() : value);
    this.endDatePeriod1().setValue(endDate);

    if (
      !this.disableOptionalDate() &&
      this.periodType1().getRawValue()?.id === 'WEEKLY' &&
      this.startDatePeriod2()
    ) {
      this.startDatePeriod2().setValue(addMonths(endDate, 1));
    }
  }
}
