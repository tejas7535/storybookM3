import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDatepicker,
  MatDateRangePicker,
} from '@angular/material/datepicker';

import { Moment } from 'moment';

import { TimePeriod } from '../models';
import { getTimeRangeFromDates } from '../utils/utilities';

@Component({
  selector: 'ia-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DateInputComponent {
  readonly startView: 'year' | 'month' | 'multi-year' = 'multi-year';
  readonly timePeriods = TimePeriod;

  dateInput = new UntypedFormControl({
    value: '',
    validators: [Validators.required],
  });

  rangeInput = new UntypedFormGroup({
    start: this.dateInput,
    end: new UntypedFormControl({
      value: '',
      validators: [Validators.required],
    }),
  });

  @Input() timePeriod: TimePeriod;

  @Input() set timeRange(timeRange: { from: Moment; to: Moment }) {
    this.rangeInput.controls.start.setValue(timeRange.from);
    this.rangeInput.controls.end.setValue(timeRange.to);
  }
  @Input() timeRangeConstraints: { min: Moment; max: Moment };
  @Input() label: string;
  @Input() hint: string;
  @Input() placeholderStart: string;
  @Input() placeholderEnd: string;

  @Output() readonly selected: EventEmitter<string> = new EventEmitter();

  onLast12MonthsSelected(
    normalizedMonthAndYear: Moment,
    datepicker: MatDateRangePicker<Moment>
  ): void {
    // emit from|to dates
    this.selected.emit(
      getTimeRangeFromDates(
        normalizedMonthAndYear
          .clone()
          .subtract(11, 'months')
          .startOf('month')
          .utc(),
        normalizedMonthAndYear.clone().endOf('month').utc()
      )
    );
    datepicker.close();
  }

  onYearSelected(
    normalizedMonthAndYear: Moment,
    datepicker: MatDatepicker<Moment>
  ): void {
    // emit from|to dates
    this.selected.emit(
      getTimeRangeFromDates(
        normalizedMonthAndYear.clone().utc().startOf('year'),
        normalizedMonthAndYear.clone().utc().endOf('year')
      )
    );
    datepicker.close();
  }

  onMonthSelected(
    normalizedMonthAndYear: Moment,
    datepicker: MatDatepicker<Moment>
  ): void {
    // emit from|to dates
    this.selected.emit(
      getTimeRangeFromDates(
        normalizedMonthAndYear.clone().utc().startOf('month'),
        normalizedMonthAndYear.clone().utc().endOf('month')
      )
    );
    datepicker.close();
  }
}
