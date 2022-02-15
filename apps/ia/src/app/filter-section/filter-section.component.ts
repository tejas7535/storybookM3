import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import {
  filterSelected,
  timePeriodSelected,
  timeRangeSelected,
} from '../core/store/actions';
import {
  getOrgUnits,
  getSelectedFilterValues,
  getSelectedOrgUnit,
  getSelectedTimePeriod,
  getSelectedTimeRange,
  getTimePeriods,
} from '../core/store/selectors';
import { Filter, IdValue, SelectedFilter, TimePeriod } from '../shared/models';

@Component({
  selector: 'ia-filter-section',
  templateUrl: './filter-section.component.html',
})
export class FilterSectionComponent implements OnInit {
  isExpanded = true;

  orgUnits$: Observable<Filter>;
  selectedOrgUnit$: Observable<string>;
  timePeriods$: Observable<IdValue[]>;
  selectedTimePeriod$: Observable<TimePeriod>;
  selectedTime$: Observable<string>;
  selectedFilterValues$: Observable<(string | number)[]>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.orgUnits$ = this.store.select(getOrgUnits);
    this.timePeriods$ = this.store.select(getTimePeriods);
    this.selectedTimePeriod$ = this.store.select(getSelectedTimePeriod);
    this.selectedOrgUnit$ = this.store.select(getSelectedOrgUnit);
    this.selectedTime$ = this.store.select(getSelectedTimeRange);
    this.selectedFilterValues$ = this.store.select(getSelectedFilterValues);
  }

  optionSelected(filter: SelectedFilter): void {
    this.store.dispatch(filterSelected({ filter }));
  }

  timePeriodSelected(timePeriod: TimePeriod): void {
    this.store.dispatch(timePeriodSelected({ timePeriod }));
  }

  timeRangeSelected(timeRange: string): void {
    this.store.dispatch(
      timeRangeSelected({
        timeRange,
      })
    );
  }

  expansionPanelToggled(expanded: boolean): void {
    this.isExpanded = expanded;
  }
}
