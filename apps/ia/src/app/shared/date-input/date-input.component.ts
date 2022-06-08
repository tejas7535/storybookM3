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
  MatDatepickerInputEvent,
  MatDateRangePicker,
} from '@angular/material/datepicker';

import moment, { Moment } from 'moment';

import { TimePeriod } from '../models';
import { getMonth12MonthsAgo, getTimeRangeFromDates } from '../utils/utilities';

@Component({
  selector: 'ia-date-input',
  templateUrl: './date-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateInputComponent {
  private _timePeriod: TimePeriod;

  timePeriods = TimePeriod;
  nowDate = moment.utc().endOf('month');
  minDate = this.nowDate.clone();
  maxDate = moment({ year: this.nowDate.year() - 1, month: 11, day: 31 }).utc(); // last day of last year

  @Input() label: string;
  @Input() hint: string;
  @Input() placeholderStart: string;
  @Input() placeholderEnd: string;
  @Input() set timePeriod(timePeriod: TimePeriod) {
    this._timePeriod = timePeriod;

    // refDate depends on year or month/last12month dropdown
    const refDate =
      timePeriod === TimePeriod.YEAR ? this.maxDate : this.nowDate;
    this.updateStartEndDates(refDate);
    this.setStartView();
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

  constructor() {
    this.minDate.set({
      year: this.minDate.year() - 3,
      month: 0,
      date: 1,
    });
  }

  dateInput = new UntypedFormControl({ value: '', disabled: true });

  rangeInput = new UntypedFormGroup({
    start: this.dateInput,
    end: new UntypedFormControl({ value: '', disabled: true }),
  });
  startView: 'multi-year' | 'month';

  updateStartEndDates(refDate: Moment): void {
    switch (this.timePeriod) {
      case TimePeriod.YEAR: {
        this.rangeInput.controls.start.setValue(
          refDate.clone().startOf('year')
        );
        this.rangeInput.controls.end.setValue(refDate.clone().endOf('year'));
        break;
      }
      case TimePeriod.LAST_12_MONTHS: {
        // use month before to prevent wrong calculations for the future
        const tmp = this.nowDate.clone().subtract(1, 'month');
        const old = getMonth12MonthsAgo(tmp);
        this.rangeInput.controls.start.setValue(old);
        this.rangeInput.controls.end.setValue(tmp);
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

  setStartView(): void {
    this.startView =
      this.timePeriod === TimePeriod.YEAR ? 'multi-year' : 'month';
  }

  public chosenYearHandler(
    year: Moment,
    datepicker: MatDateRangePicker<any> | MatDatepicker<any>
  ): void {
    if (this.timePeriod === TimePeriod.YEAR) {
      this.updateStartEndDates(year);
      datepicker.close();
    }
  }

  startDateChanged(
    evt: MatDatepickerInputEvent<any>,
    datepicker: MatDateRangePicker<any>,
    endDateInput: HTMLInputElement
  ): void {
    if (
      (this.timePeriod === TimePeriod.YEAR ||
        this.timePeriod === TimePeriod.LAST_12_MONTHS) &&
      evt.value
    ) {
      this.updateStartEndDates(evt.value);

      datepicker.close();
      endDateInput.focus();
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
