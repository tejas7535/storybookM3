import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { debounceTime, filter, map } from 'rxjs/operators';

import { endOfDay, startOfDay } from 'date-fns';

import { Interval } from '../../core/store/reducers/shared/models';

@Component({
  selector: 'goldwind-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss'],
})
export class DateRangeComponent implements OnInit, OnChanges {
  @Input() interval: Interval;
  @Output() readonly rangeChange: EventEmitter<Interval> = new EventEmitter();

  rangeForm = new FormGroup({
    startDate: new FormControl('', Validators.required),
    endDate: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.rangeForm.valueChanges
      .pipe(
        debounceTime(500),
        filter(() => this.rangeForm.valid && this.rangeForm.dirty),
        map(({ startDate, endDate }: { startDate: Date; endDate: Date }) =>
          this.rangeChange.emit({
            startDate: Math.floor(+startOfDay(startDate) / 1000),
            endDate: Math.floor(+endOfDay(endDate) / 1000),
          })
        )
      )
      .subscribe();
  }

  ngOnChanges(): void {
    this.rangeForm.setValue({
      startDate: new Date(this.interval.startDate * 1000),
      endDate: new Date(this.interval.endDate * 1000),
    });
    this.rangeForm.markAsPristine();
  }
}
