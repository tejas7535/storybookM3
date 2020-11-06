import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';

import {
  filterSelected,
  timePeriodSelected,
  timeRangeSelected,
} from '../core/store/actions';
import { EmployeeState } from '../core/store/reducers/employee/employee.reducer';
import {
  getCountries,
  getLocations,
  getOrganizations,
  getRegionsAndSubRegions,
  getSelectedTimePeriod,
  getTimePeriods,
} from '../core/store/selectors';
import { Filter, IdValue, TimePeriod } from '../shared/models';

@Component({
  selector: 'ia-filter-section',
  templateUrl: './filter-section.component.html',
  styleUrls: ['./filter-section.component.scss'],
})
export class FilterSectionComponent implements OnInit {
  organizations$: Observable<Filter>;
  regionsAndSubRegions$: Observable<Filter>;
  countries$: Observable<Filter>;
  locations$: Observable<Filter>;
  timePeriods$: Observable<IdValue[]>;
  selectedTimePeriod$: Observable<TimePeriod>;

  timeRangeHintValue = 'time range';

  public constructor(private readonly store: Store<EmployeeState>) {}

  public ngOnInit(): void {
    this.organizations$ = this.store.pipe(select(getOrganizations));
    this.regionsAndSubRegions$ = this.store.pipe(
      select(getRegionsAndSubRegions)
    );
    this.countries$ = this.store.pipe(select(getCountries));
    this.locations$ = this.store.pipe(select(getLocations));
    this.timePeriods$ = this.store.pipe(select(getTimePeriods));
    this.selectedTimePeriod$ = this.store.pipe(
      select(getSelectedTimePeriod),
      tap((timePeriod) => this.setTimeRangeHint(timePeriod))
    );
  }

  public optionSelected(filter: Filter): void {
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
      timePeriodSelected({ timePeriod: (idValue.id as unknown) as TimePeriod })
    );
  }

  public timeRangeSelected(timeRange: string): void {
    this.store.dispatch(
      timeRangeSelected({
        timeRange,
      })
    );
  }
}
