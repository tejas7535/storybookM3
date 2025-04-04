import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { tap } from 'rxjs';

import { addMonths, endOfMonth, startOfMonth } from 'date-fns';

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
import { DateRangePeriod } from '../../../../shared/utils/date-range';

@Component({
  selector: 'd360-demand-validation-date-picker',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePickerComponent,
    FilterDropdownComponent,
    SharedTranslocoModule,
    DatePickerMonthYearComponent,
  ],
  templateUrl: './demand-validation-date-picker.component.html',
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
  protected readonly DateRangePeriod = DateRangePeriod;

  protected minDateEndDatePeriod1: Date;
  protected minDateEndDatePeriod2: Date;

  public ngOnInit(): void {
    this.minDateEndDatePeriod2 = [undefined, null].includes(
      this.endDatePeriod2()?.getRawValue()
    )
      ? firstViewableDate()
      : startOfMonth(addMonths(toNativeDate(this.endDatePeriod1().value), 1));

    this.minDateEndDatePeriod1 = this.startDatePeriod1().getRawValue();

    this.endDatePeriod1()
      .valueChanges.pipe(
        tap((value) => this._endDatePeriod1Change(value)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

    this.startDatePeriod1()
      .valueChanges.pipe(
        tap(
          () =>
            (this.minDateEndDatePeriod1 = this.startDatePeriod1().getRawValue())
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected onPeriodTypeChange(event: SelectableValue): void {
    this.endDatePeriod2()?.setValue(null, { emitEvent: false });
    this.periodType2()?.disable({ emitEvent: false });
    this.startDatePeriod2()?.disable({ emitEvent: false });

    if (event.id === DateRangePeriod.Weekly && !this.disableOptionalDate()) {
      this._endDatePeriod1Change(this.endDatePeriod1().getRawValue());
    }
  }

  private _endDatePeriod1Change(value: Date): void {
    const endDate = endOfMonth(toNativeDate(value));
    this.endDatePeriod1().setValue(endDate, { emitEvent: false });

    if (
      !this.disableOptionalDate() &&
      this.periodType1().getRawValue()?.id === DateRangePeriod.Weekly &&
      this.startDatePeriod2()
    ) {
      this.startDatePeriod2().setValue(startOfMonth(addMonths(endDate, 1)));
    }
  }
}
