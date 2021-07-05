import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import {
  filterSelected,
  timePeriodSelected,
  timeRangeSelected,
} from '../core/store/actions';
import {
  getOrgUnits,
  getSelectedOrgUnit,
  getSelectedTimePeriod,
  getTimePeriods,
} from '../core/store/selectors';
import { Filter, IdValue, SelectedFilter, TimePeriod } from '../shared/models';

@Component({
  selector: 'ia-filter-section',
  templateUrl: './filter-section.component.html',
})
export class FilterSectionComponent implements OnInit {
  orgUnits$: Observable<Filter>;
  selectedOrgUnit$: Observable<string>;
  timePeriods$: Observable<IdValue[]>;
  selectedTimePeriod$: Observable<TimePeriod>;

  timeRangeHintValue = 'time range';
  disabledTimeRangeFilter = true;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.orgUnits$ = this.store.select(getOrgUnits);
    this.timePeriods$ = this.store.select(getTimePeriods);
    this.selectedTimePeriod$ = this.store
      .select(getSelectedTimePeriod)
      .pipe(tap((timePeriod) => this.setTimeRangeHint(timePeriod)));
    this.selectedOrgUnit$ = this.store
      .select(getSelectedOrgUnit)
      .pipe(
        tap((value) => (this.disabledTimeRangeFilter = value === undefined))
      );
  }

  optionSelected(filter: SelectedFilter): void {
    this.store.dispatch(filterSelected({ filter }));
  }

  setTimeRangeHint(timePeriod: TimePeriod): void {
    switch (timePeriod) {
      case TimePeriod.YEAR: {
        this.timeRangeHintValue = 'year';
        break;
      }
      case TimePeriod.MONTH: {
        this.timeRangeHintValue = 'month';
        break;
      }
      case TimePeriod.LAST_12_MONTHS: {
        this.timeRangeHintValue = 'reference date';
        break;
      }
      default: {
        this.timeRangeHintValue = 'time range';
      }
    }
  }

  timePeriodSelected(idValue: IdValue): void {
    this.store.dispatch(
      timePeriodSelected({ timePeriod: idValue.id as unknown as TimePeriod })
    );
  }

  orgUnitInvalid(orgUnitIsInvalid: boolean): void {
    this.disabledTimeRangeFilter = orgUnitIsInvalid;
  }

  timeRangeSelected(timeRange: string): void {
    this.store.dispatch(
      timeRangeSelected({
        timeRange,
      })
    );
  }
}
