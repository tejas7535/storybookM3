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
  @Input() set disabled(disable: boolean) {
    if (disable) {
      this.rangeInput.controls.start.disable();
      this.rangeInput.controls.end.disable();
    } else {
      this.rangeInput.controls.start.enable();
      this.rangeInput.controls.end.enable();
    }
  }

  get timePeriod(): TimePeriod {
    return this._timePeriod;
  }

  @Output() readonly selected: EventEmitter<string> = new EventEmitter();

  rangeInput = new FormGroup({
    start: new FormControl({ value: '', disabled: true }),
    end: new FormControl({ value: '', disabled: true }),
  });
  startView: 'multi-year' | 'month' | 'year' = 'multi-year';
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

    // TODO: quickfix | violates Angular's unidirectional flow -> expressionchangedaftercheck error -> needs to be changed after PoC
    setTimeout(() => {
      this.emitChange();
    }, 50);
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

  public startDateChanged(
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
