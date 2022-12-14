import { Component, OnInit } from '@angular/core';

import { map, Observable } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import {
  filterSelected,
  loadFilterDimensionData,
  timePeriodSelected,
} from '../core/store/actions';
import {
  getOrgUnitsLoading,
  getSelectedDimension,
  getSelectedDimensionDataLoading,
  getSelectedDimensionFilter,
  getSelectedDimensionIdValue,
  getSelectedFilterValues,
  getSelectedTimePeriod,
  getSelectedTimeRange,
  getTimePeriods,
} from '../core/store/selectors';
import { FILTER_DIMENSIONS } from '../shared/constants';
import { FilterLayout } from '../shared/filter/filter-layout.enum';
import {
  Filter,
  FilterDimension,
  IdValue,
  SelectedFilter,
  TimePeriod,
} from '../shared/models';

@Component({
  selector: 'ia-filter-section',
  templateUrl: './filter-section.component.html',
})
export class FilterSectionComponent implements OnInit {
  isExpanded = true;

  availableDimensions$: Observable<IdValue[]>;
  activeDimension$: Observable<FilterDimension>;
  selectedDimensionFilter$: Observable<Filter>;
  orgUnitsLoading$: Observable<boolean>;
  selectedDimensionDataLoading$: Observable<boolean>;
  selectedDimensionIdValue$: Observable<IdValue>;
  timePeriods$: Observable<IdValue[]>;
  selectedTimePeriod$: Observable<TimePeriod>;
  selectedTime$: Observable<IdValue>;
  selectedFilterValues$: Observable<string[]>;

  filterLayout = FilterLayout;

  constructor(
    private readonly store: Store,
    private readonly translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    this.availableDimensions$ = this.translocoService
      .selectTranslateObject('filters.dimension.availableDimensions')
      .pipe(
        map((translateObject) =>
          this.mapTranslationsToIdValues(translateObject)
        )
      );
    this.activeDimension$ = this.store.select(getSelectedDimension);
    this.selectedDimensionDataLoading$ = this.store.select(
      getSelectedDimensionDataLoading
    );
    this.selectedDimensionFilter$ = this.store.select(
      getSelectedDimensionFilter
    );
    this.orgUnitsLoading$ = this.store.select(getOrgUnitsLoading);
    this.timePeriods$ = this.store.select(getTimePeriods);
    this.selectedTimePeriod$ = this.store.select(getSelectedTimePeriod);
    this.selectedDimensionIdValue$ = this.store.select(
      getSelectedDimensionIdValue
    );
    this.selectedTime$ = this.store.select(getSelectedTimeRange);
    this.selectedFilterValues$ = this.store.select(getSelectedFilterValues);
  }

  dimensionSelected(dimension: IdValue): void {
    const filterDimension = Object.entries(FilterDimension).find(
      ([_, value]) => value === dimension.id
    )?.[1];

    this.store.dispatch(loadFilterDimensionData({ filterDimension }));
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
        filterDimension: FilterDimension.ORG_UNIT,
        searchFor,
      })
    );
  }

  mapTranslationsToIdValues(
    translations: Record<FilterDimension, string>
  ): IdValue[] {
    return FILTER_DIMENSIONS.map(
      (dimensionLevel) =>
        new IdValue(
          dimensionLevel.dimension,
          translations[dimensionLevel.dimension],
          dimensionLevel.level
        )
    );
  }
}
