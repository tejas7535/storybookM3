import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import {
  MatDatepicker,
  MatDateRangePicker,
} from '@angular/material/datepicker';

import moment, { Moment } from 'moment';

import { DATA_IMPORT_DAY } from '../constants';
import { TimePeriod } from '../models';
import { getMonth12MonthsAgo, getTimeRangeFromDates } from '../utils/utilities';

@Component({
  selector: 'ia-date-input',
  templateUrl: './date-input.component.html',
  styles: [
    `
      ::ng-deep .mat-calendar-period-button {
        pointer-events: none;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateInputComponent {
  readonly PREVIOUS_YEARS_AVAILABLE = 3;
  readonly startView: 'year' | 'month' | 'multi-year' = 'multi-year';
  readonly timePeriods = TimePeriod;

  // minimal date when data is correct
  readonly MIN_DATE = {
    year: 2021,
    month: 1,
    date: 1,
  };

  private _timePeriod: TimePeriod;

  dateInput = new UntypedFormControl({ value: '', disabled: true });

  rangeInput = new UntypedFormGroup({
    start: this.dateInput,
    end: new UntypedFormControl({ value: '', disabled: true }),
  });

  nowDate = moment()
    .utc()
    .subtract(DATA_IMPORT_DAY - 1, 'day') // use previous month if data is not imported yet
    .endOf('month');
  minDate = moment(this.MIN_DATE);
  maxDate = moment({ year: this.nowDate.year() - 1, month: 11, day: 31 }).utc(); // last day of last year

  @Input() label: string;
  @Input() hint: string;
  @Input() placeholderStart: string;
  @Input() placeholderEnd: string;

  @Input() set timePeriod(timePeriod: TimePeriod) {
    // refDate depends on year or month/last12month dropdown
    if (!this.timePeriod) {
      this._timePeriod = timePeriod;
      this.setInitialStartEndDates();
    } else {
      this._timePeriod = timePeriod;
      let refDate;
      if (timePeriod === TimePeriod.YEAR) {
        refDate = this.maxDate.clone().subtract(1, 'year').endOf('year');
      } else if (timePeriod === TimePeriod.LAST_12_MONTHS) {
        refDate = this.nowDate;
      } else {
        refDate = this.nowDate.clone().subtract(1, 'month').utc();
      }
      this.updateStartEndDates(refDate);
    }
  }

  get timePeriod(): TimePeriod {
    return this._timePeriod;
  }

  @Input() set selectedTime(time: string) {
    if (time !== undefined) {
      const times = time.split('|');

      const start = moment.unix(+times[0]).utc();
      this.rangeInput.controls.start.setValue(start, { emitEvent: false });
      const end = moment.unix(+times[1]).utc();
      this.rangeInput.controls.end.setValue(end, { emitEvent: false });
    }
  }

  @Input() set disabled(disable: boolean) {
    if (disable) {
      this.rangeInput.controls.start.disable();
      this.rangeInput.controls.end.disable();
    } else {
      this.rangeInput.controls.start.enable();
      this.rangeInput.controls.end.enable();
    }
  }

  @Output() readonly selected: EventEmitter<string> = new EventEmitter();

  setInitialStartEndDates() {
    if (
      this.timePeriod === TimePeriod.MONTH ||
      this.timePeriod === TimePeriod.YEAR
    ) {
      const onePeriodBefore = this.nowDate
        .clone()
        .subtract(1, this.timePeriod)
        .endOf(this.timePeriod)
        .utc();
      this.maxDate = onePeriodBefore;

      this.rangeInput.controls.end.setValue(onePeriodBefore);
      this.rangeInput.controls.start.setValue(
        onePeriodBefore.clone().startOf(this.timePeriod)
      );
    }
  }

  updateStartEndDates(refDate: Moment): void {
    switch (this.timePeriod) {
      case TimePeriod.YEAR: {
        this.maxDate = moment({
          year: this.nowDate.year() - 1,
          month: 11,
          day: 31,
        }).utc(); // last day of last year
        this.rangeInput.controls.start.setValue(
          refDate.clone().startOf('year').utc()
        );
        this.rangeInput.controls.end.setValue(
          refDate.clone().endOf('year').utc()
        );
        // set min date as 2021-01-01 to prevent invalid status of input field
        this.minDate = moment({ year: 2021, month: 0, day: 1 });
        break;
      }
      case TimePeriod.MONTH: {
        this.maxDate = this.nowDate
          .clone()
          .subtract(1, 'month')
          .endOf('month')
          .utc();
        const start = refDate.clone().startOf('month').utc();
        const end = refDate.clone().endOf('month').utc();
        this.rangeInput.controls.start.setValue(start);
        this.rangeInput.controls.end.setValue(end);
        this.minDate = moment(this.MIN_DATE);
        break;
      }
      case TimePeriod.LAST_12_MONTHS: {
        // use month before to prevent wrong calculations for the future
        const tmp = this.nowDate
          .clone()
          .subtract(1, 'month')
          .endOf('month')
          .utc();
        const old = getMonth12MonthsAgo(tmp);
        this.rangeInput.controls.start.setValue(old);
        this.rangeInput.controls.end.setValue(tmp);
        this.minDate = moment(this.MIN_DATE);
        break;
      }
      default: {
        return;
      }
    }

    // TODO: quickfix | violates Angular's unidirectional flow -> expressionchangedaftercheck error -> needs to be changed after PoC
    setTimeout(() => {
      this.emitChange();
    }, 50);
  }

  chosenYearHandler(
    year: Moment,
    datepicker: MatDateRangePicker<any> | MatDatepicker<any>
  ): void {
    if (this.timePeriod === TimePeriod.YEAR) {
      this.updateStartEndDates(year);
      datepicker.close();
    }
  }

  chosenMonthHandler(
    month: Moment,
    datepicker: MatDateRangePicker<any> | MatDatepicker<any>
  ): void {
    if (this.timePeriod === TimePeriod.MONTH) {
      this.updateStartEndDates(month);
      datepicker.close();
    }
  }

  emitChange(): void {
    // emit from|to dates
    this.selected.emit(
      getTimeRangeFromDates(
        this.rangeInput.controls.start.value,
        this.rangeInput.controls.end.value
      )
    );
  }
}
