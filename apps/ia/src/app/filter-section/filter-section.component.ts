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
  getSelectedTimeRange,
  getTimePeriods,
} from '../core/store/selectors';
import { Filter, IdValue, SelectedFilter, TimePeriod } from '../shared/models';
import { getTimeRangeHint } from '../shared/utils/utilities';

@Component({
  selector: 'ia-filter-section',
  templateUrl: './filter-section.component.html',
})
export class FilterSectionComponent implements OnInit {
  orgUnits$: Observable<Filter>;
  selectedOrgUnit$: Observable<string>;
  timePeriods$: Observable<IdValue[]>;
  selectedTimePeriod$: Observable<TimePeriod>;
  selectedTime$: Observable<string>;

  timeRangeHintValue = 'time range';
  disabledTimeRangeFilter = true;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.orgUnits$ = this.store.select(getOrgUnits);
    this.timePeriods$ = this.store.select(getTimePeriods);
    this.selectedTimePeriod$ = this.store.select(getSelectedTimePeriod).pipe(
      tap((timePeriod) => {
        this.timeRangeHintValue = getTimeRangeHint(timePeriod);
      })
    );
    this.selectedOrgUnit$ = this.store
      .select(getSelectedOrgUnit)
      .pipe(
        tap((value) => (this.disabledTimeRangeFilter = value === undefined))
      );
    this.selectedTime$ = this.store.select(getSelectedTimeRange);
  }

  optionSelected(filter: SelectedFilter): void {
    this.store.dispatch(filterSelected({ filter }));
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
