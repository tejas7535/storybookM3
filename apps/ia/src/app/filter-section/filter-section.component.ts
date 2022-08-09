import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import {
  filterSelected,
  loadFilterDimensionData,
  timePeriodSelected,
} from '../core/store/actions';
import { FilterDimension } from '../core/store/reducers/filter/filter.reducer';
import {
  getOrgUnitsFilter,
  getOrgUnitsLoading,
  getSelectedFilterValues,
  getSelectedOrgUnit,
  getSelectedTimePeriod,
  getSelectedTimeRange,
  getTimePeriods,
} from '../core/store/selectors';
import { FilterLayout } from '../shared/filter/filter-layout.enum';
import { Filter, IdValue, SelectedFilter, TimePeriod } from '../shared/models';

@Component({
  selector: 'ia-filter-section',
  templateUrl: './filter-section.component.html',
})
export class FilterSectionComponent implements OnInit {
  isExpanded = true;

  orgUnitsFilter$: Observable<Filter>;
  orgUnitsLoading$: Observable<boolean>;
  selectedOrgUnit$: Observable<IdValue>;
  timePeriods$: Observable<IdValue[]>;
  selectedTimePeriod$: Observable<TimePeriod>;
  selectedTime$: Observable<IdValue>;
  selectedFilterValues$: Observable<string[]>;

  filterLayout = FilterLayout;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.orgUnitsFilter$ = this.store.select(getOrgUnitsFilter);
    this.orgUnitsLoading$ = this.store.select(getOrgUnitsLoading);
    this.timePeriods$ = this.store.select(getTimePeriods);
    this.selectedTimePeriod$ = this.store.select(getSelectedTimePeriod);
    this.selectedOrgUnit$ = this.store.select(getSelectedOrgUnit);
    this.selectedTime$ = this.store.select(getSelectedTimeRange);
    this.selectedFilterValues$ = this.store.select(getSelectedFilterValues);
  }

  filterSelected(filter: SelectedFilter): void {
    this.store.dispatch(filterSelected({ filter }));
  }

  timePeriodSelected(timePeriod: TimePeriod): void {
    this.store.dispatch(timePeriodSelected({ timePeriod }));
  }

  expansionPanelToggled(expanded: boolean): void {
    this.isExpanded = expanded;
  }

  autoCompleteOrgUnitsChange(searchFor: string): void {
    this.store.dispatch(
      loadFilterDimensionData({
        filterDimension: FilterDimension.ORG_UNITS,
        searchFor,
      })
    );
  }
}
