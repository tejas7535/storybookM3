import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MatDatepicker,
  MatDatepickerInputEvent,
} from '@angular/material/datepicker';
import { MatInput } from '@angular/material/input';

import { TimePeriod } from '../models';

@Component({
  selector: 'ia-date-input',
  templateUrl: './date-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateInputComponent {
  private _timePeriod: TimePeriod;

  @Input() label: string;
  @Input() hint: string;
  @Input() placeholderStart: string;
  @Input() placeholderEnd: string;
  @Input() set timePeriod(timePeriod: TimePeriod) {
    const date = new Date('2020-12-31');
    this._timePeriod = timePeriod;
    this.updateStartEndDates(date);
    this.setStartView();
  }

  get timePeriod(): TimePeriod {
    return this._timePeriod;
  }

  @Output() readonly selected: EventEmitter<string> = new EventEmitter();

  rangeInput = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  startView = '';
  minDate = new Date('2019-01-01 00:00:00');
  maxDate = new Date('2020-12-31 00:00:00');

  public updateStartEndDates(refDate: Date): void {
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
        this.minDate = new Date('2019-12-31 00:00:00');

        if (this.minDate.getTime() <= refDate.getTime()) {
          this.minDate = new Date('2019-01-01');
        }
        const old = new Date(refDate.getTime());
        old.setMonth(refDate.getMonth() - 12);
        old.setDate(old.getDate() + 1);
        this.rangeInput.controls.start.setValue(old);
        this.rangeInput.controls.end.setValue(refDate);
        break;
      }
      default: {
        return;
      }
    }

    this.emitChange();
  }

  public setStartView(): void {
    this.startView =
      this.timePeriod === TimePeriod.YEAR
        ? 'multi-year'
        : this.timePeriod === TimePeriod.MONTH
        ? 'year'
        : 'month';
  }

  public chosenMonthHandler(
    month: Date,
    datepicker: MatDatepicker<Date>
  ): void {
    if (this.timePeriod === TimePeriod.MONTH) {
      this.updateStartEndDates(month);
      datepicker.close();
    }
  }

  public chosenYearHandler(year: Date, datepicker: MatDatepicker<Date>): void {
    if (this.timePeriod === TimePeriod.YEAR) {
      this.updateStartEndDates(year);
      datepicker.close();
    }
  }

  public startDateChanged(
    evt: MatDatepickerInputEvent<any>,
    datepicker: MatDatepicker<Date>,
    endDateInput: MatInput
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

  public endDateChanged(evt: MatDatepickerInputEvent<any>): void {
    if (this.timePeriod === TimePeriod.CUSTOM && evt.value) {
      this.emitChange();
    }
  }

  public emitChange(): void {
    // emit from|to dates
    this.selected.emit(
      `${this.rangeInput.controls.start.value.getTime()}|${this.rangeInput.controls.end.value.getTime()}`
    );
  }
}
