import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import {
  filterSelected,
  timePeriodSelected,
  timeRangeSelected,
} from '../core/store/actions';
import {
  getCountries,
  getHrLocations,
  getOrgUnits,
  getRegionsAndSubRegions,
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
  regionsAndSubRegions$: Observable<Filter>;
  countries$: Observable<Filter>;
  hrLocations$: Observable<Filter>;
  timePeriods$: Observable<IdValue[]>;
  selectedTimePeriod$: Observable<TimePeriod>;

  // TODO: area filters (Region, Sub-Region, HR-Location) are switched off for PoC
  showAreaFilters = false;

  timeRangeHintValue = 'time range';
  disabledTimeRangeFilter = true;

  public constructor(private readonly store: Store) {}

  public ngOnInit(): void {
    this.orgUnits$ = this.store.select(getOrgUnits);
    this.regionsAndSubRegions$ = this.store.select(getRegionsAndSubRegions);
    this.countries$ = this.store.select(getCountries);
    this.hrLocations$ = this.store.select(getHrLocations);
    this.timePeriods$ = this.store.select(getTimePeriods);
    this.selectedTimePeriod$ = this.store
      .select(getSelectedTimePeriod)
      .pipe(tap((timePeriod) => this.setTimeRangeHint(timePeriod)));
    this.selectedOrgUnit$ = this.store.select(getSelectedOrgUnit).pipe(
      map((value: string | number) => value?.toLocaleString()),
      tap((value) => (this.disabledTimeRangeFilter = !value))
    );
  }

  public optionSelected(filter: SelectedFilter): void {
    this.store.dispatch(filterSelected({ filter }));
  }

  public setTimeRangeHint(timePeriod: TimePeriod): void {
    this.timeRangeHintValue =
      timePeriod === TimePeriod.YEAR
        ? 'year'
        : timePeriod === TimePeriod.MONTH
        ? 'month'
        : timePeriod === TimePeriod.LAST_12_MONTHS
        ? 'reference date'
        : 'time range';
  }

  public timePeriodSelected(idValue: IdValue): void {
    this.store.dispatch(
      timePeriodSelected({ timePeriod: idValue.id as unknown as TimePeriod })
    );
  }

  public orgUnitInvalid(orgUnitIsInvalid: boolean): void {
    this.disabledTimeRangeFilter = orgUnitIsInvalid;
  }

  public timeRangeSelected(timeRange: string): void {
    this.store.dispatch(
      timeRangeSelected({
        timeRange,
      })
    );
  }
}
