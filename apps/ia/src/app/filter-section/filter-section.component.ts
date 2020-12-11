import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import {
  filterSelected,
  timePeriodSelected,
  timeRangeSelected,
} from '../core/store/actions';
import { FilterState } from '../core/store/reducers/filter/filter.reducer';
import {
  getCountries,
  getHrLocations,
  getOrgUnits,
  getRegionsAndSubRegions,
  getSelectedTimePeriod,
  getTimePeriods,
} from '../core/store/selectors';
import { Filter, IdValue, SelectedFilter, TimePeriod } from '../shared/models';

@Component({
  selector: 'ia-filter-section',
  templateUrl: './filter-section.component.html',
  styleUrls: ['./filter-section.component.scss'],
})
export class FilterSectionComponent implements OnInit {
  orgUnits$: Observable<Filter>;
  regionsAndSubRegions$: Observable<Filter>;
  countries$: Observable<Filter>;
  hrLocations$: Observable<Filter>;
  timePeriods$: Observable<IdValue[]>;
  selectedTimePeriod$: Observable<TimePeriod>;

  // TODO: area filters (Region, Sub-Region, HR-Location) are switched off for PoC
  showAreaFilters = false;

  timeRangeHintValue = 'time range';
  disabledTimeRangeFilter = true;

  public constructor(private readonly store: Store<FilterState>) {}

  public ngOnInit(): void {
    this.orgUnits$ = this.store.pipe(select(getOrgUnits));
    this.regionsAndSubRegions$ = this.store.pipe(
      select(getRegionsAndSubRegions)
    );
    this.countries$ = this.store.pipe(select(getCountries));
    this.hrLocations$ = this.store.pipe(select(getHrLocations));
    this.timePeriods$ = this.store.pipe(select(getTimePeriods));
    this.selectedTimePeriod$ = this.store.pipe(
      select(getSelectedTimePeriod),
      tap((timePeriod) => this.setTimeRangeHint(timePeriod))
    );
  }

  public optionSelected(filter: SelectedFilter): void {
    this.store.dispatch(filterSelected({ filter }));
    this.disabledTimeRangeFilter = false;
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
      timePeriodSelected({ timePeriod: (idValue.id as unknown) as TimePeriod })
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
