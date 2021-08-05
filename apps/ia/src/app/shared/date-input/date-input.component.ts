import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MatDatepickerInputEvent,
  MatDateRangePicker,
} from '@angular/material/datepicker';

import { TimePeriod } from '../models';

@Component({
  selector: 'ia-date-input',
  templateUrl: './date-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateInputComponent {
  private _timePeriod: TimePeriod;

  timePeriods = TimePeriod;
  nowDate = new Date();
  minDate = new Date('2010-01-01 00:00:00');
  maxDate = new Date(this.nowDate.getFullYear(), 11, 31); // last day of current year

  @Input() label: string;
  @Input() hint: string;
  @Input() placeholderStart: string;
  @Input() placeholderEnd: string;
  @Input() set timePeriod(timePeriod: TimePeriod) {
    this._timePeriod = timePeriod;
    this.updateStartEndDates(this.nowDate);
    this.setStartView();
  }
  get timePeriod(): TimePeriod {
    return this._timePeriod;
  }

  @Input() set selectedTime(time: string) {
    if (time !== undefined) {
      const times = time.split('|');

      const start = new Date(+times[0]);
      this.rangeInput.controls.start.setValue(start, { emitEvent: false });
      const end = new Date(+times[1]);
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

  rangeInput = new FormGroup({
    start: new FormControl({ value: '', disabled: true }),
    end: new FormControl({ value: '', disabled: true }),
  });
  startView: 'multi-year' | 'month' | 'year' = 'multi-year';

  updateStartEndDates(refDate: Date): void {
    switch (this.timePeriod) {
      case TimePeriod.MONTH: {
        this.rangeInput.controls.start.setValue(
          new Date(refDate.getFullYear(), refDate.getMonth(), 1)
        );
        this.rangeInput.controls.end.setValue(
          new Date(refDate.getFullYear(), refDate.getMonth() + 1, 0)
        );
        break;
      }
      case TimePeriod.YEAR: {
        this.rangeInput.controls.start.setValue(
          new Date(refDate.getFullYear(), 0, 1)
        );
        this.rangeInput.controls.end.setValue(
          new Date(refDate.getFullYear(), 12, 0)
        );
        break;
      }
      case TimePeriod.LAST_12_MONTHS: {
        const old = new Date(this.nowDate.getTime());
        old.setMonth(this.nowDate.getMonth() - 12);
        old.setDate(old.getDate() + 1);
        this.rangeInput.controls.start.setValue(old);
        this.rangeInput.controls.end.setValue(this.nowDate);
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
    if (this.timePeriod === TimePeriod.YEAR) {
      this.startView = 'multi-year';
    } else if (this.timePeriod === TimePeriod.MONTH) {
      this.startView = 'year';
    } else {
      this.startView = 'month';
    }
  }

  public chosenMonthHandler(
    month: Date,
    datepicker: MatDateRangePicker<any>
  ): void {
    if (this.timePeriod === TimePeriod.MONTH) {
      this.updateStartEndDates(month);
      datepicker.close();
    }
  }

  public chosenYearHandler(
    year: Date,
    datepicker: MatDateRangePicker<any>
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
        this.timePeriod === TimePeriod.MONTH ||
        this.timePeriod === TimePeriod.LAST_12_MONTHS) &&
      evt.value
    ) {
      this.updateStartEndDates(evt.value);

      datepicker.close();
      endDateInput.focus();
    }
  }

  endDateChanged(evt: MatDatepickerInputEvent<any>): void {
    if (this.timePeriod === TimePeriod.CUSTOM && evt.value) {
      this.emitChange();
    }
  }

  emitChange(): void {
    // emit from|to dates
    this.selected.emit(
      `${this.rangeInput.controls.start.value.getTime()}|${this.rangeInput.controls.end.value.getTime()}`
    );
  }
}
