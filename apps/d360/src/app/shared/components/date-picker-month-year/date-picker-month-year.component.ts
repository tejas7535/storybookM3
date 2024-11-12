import { JsonPipe } from '@angular/common';
import { Component, inject, input, InputSignal, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { addMonths, subMonths } from 'date-fns';
import moment, { isMoment, Moment } from 'moment';

import { SharedTranslocoModule } from '@schaeffler/transloco';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM.YYYY',
  },
  display: {
    dateInput: 'MM.YYYY',
    monthLabel: 'MM.YYYY',
    monthYearLabel: 'MM.YYYY',
    dateA11yLabel: 'MM.YYYY',
    monthYearA11yLabel: 'MM.YYYY',
  },
};

@Component({
  selector: 'd360-date-picker-month-year',
  standalone: true,
  imports: [
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    SharedTranslocoModule,
    JsonPipe,
  ],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
  templateUrl: './date-picker-month-year.component.html',
  styleUrls: ['./date-picker-month-year.component.scss'],
})
export class DatePickerMonthYearComponent implements OnInit {
  private readonly translocoLocaleService: TranslocoLocaleService = inject(
    TranslocoLocaleService
  );

  private readonly adapter: DateAdapter<Moment> = inject(DateAdapter<Moment>);

  protected label: InputSignal<string> = input('');
  protected control: InputSignal<FormControl> = input(new FormControl(''));
  protected hint: InputSignal<string> = input('');
  protected errorMessage: InputSignal<string> = input('');
  protected minDate: InputSignal<Date> = input(subMonths(new Date(), 36));
  protected maxDate: InputSignal<Date> = input(addMonths(new Date(), 36));
  protected endOf: InputSignal<boolean> = input(false);
  protected appearance: InputSignal<MatFormFieldAppearance> =
    input<MatFormFieldAppearance>('outline');

  /**
   * @inheritdoc
   */
  public ngOnInit(): void {
    this.adapter.setLocale(this.translocoLocaleService.getLocale());

    // convert to moment
    const value = this.control().getRawValue();
    if (value && !isMoment(value)) {
      this.control().setValue(moment(value, 'LL'));
    }
  }

  protected onSelectMonth(event: any, datepicker: MatDatepicker<Moment>) {
    this.control().setValue(
      this.endOf ? moment(event).endOf('month') : moment(event).startOf('month')
    );

    datepicker.close();
  }
}
