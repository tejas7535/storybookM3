import { Component, input, InputSignal, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { addMonths, endOfMonth, startOfMonth, subMonths } from 'date-fns';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { monthYearDateFormatFactory } from '../../constants/available-locales';

@Component({
  selector: 'd360-date-picker-month-year',
  imports: [
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    SharedTranslocoModule,
  ],
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useFactory: monthYearDateFormatFactory,
      deps: [DateAdapter],
    },
  ],
  templateUrl: './date-picker-month-year.component.html',
})
export class DatePickerMonthYearComponent implements OnInit {
  protected label: InputSignal<string> = input('');
  protected control: InputSignal<FormControl> = input.required();
  protected hint: InputSignal<string> = input('');
  protected errorMessage: InputSignal<string> = input('');
  protected minDate: InputSignal<Date> = input(
    startOfMonth(subMonths(new Date(), 36))
  );
  protected maxDate: InputSignal<Date> = input(
    endOfMonth(addMonths(new Date(), 36))
  );

  /**
   * Round the date?
   *
   * true: rounds to last day of the month
   * false: rounds to first day of the month
   * null: no changes
   *
   * @protected
   * @type {(InputSignal<boolean | null>)}
   * @memberof DatePickerMonthYearComponent
   */
  protected endOf: InputSignal<boolean | null> = input.required();
  protected appearance: InputSignal<MatFormFieldAppearance> =
    input<MatFormFieldAppearance>('outline');

  /**
   * @inheritdoc
   */
  public ngOnInit(): void {
    // convert to date
    const value = this.control().getRawValue();
    if (value && !(value instanceof Date)) {
      this.control().setValue(new Date(value), { emitEvent: false });
      this.setValue(this.control().getRawValue());
    }
  }

  protected onSelectMonth(event: any, datepicker: MatDatepicker<Date>) {
    this.setValue(event);

    datepicker.close();
  }

  private setValue(date: Date | number | string): void {
    if (this.endOf() === null) {
      return;
    }

    this.control().setValue(
      this.endOf() ? endOfMonth(date) : startOfMonth(date)
    );
  }
}
