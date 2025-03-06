import { Component, OnInit } from '@angular/core';

import { map, Observable } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { Moment } from 'moment';

import {
  autocompleteBenchmarkDimensionData,
  autocompleteDimensionData,
  benchmarkFilterSelected,
  dimensionSelected,
  filterSelected,
  loadFilterBenchmarkDimensionData,
  loadFilterDimensionData,
  timePeriodSelected,
} from '../core/store/actions';
import {
  getBeautifiedFilterValues,
  getBenchmarkDimension,
  getBenchmarkDimensionDataLoading,
  getBenchmarkDimensionFilter,
  getBenchmarkIdValue,
  getMomentTimeRangeConstraints,
  getSelectedDimension,
  getSelectedDimensionDataLoading,
  getSelectedDimensionFilter,
  getSelectedDimensionIdValue,
  getSelectedMomentTimeRange,
  getSelectedTimePeriod,
  getTimePeriods,
  showBenchmarkFilter,
} from '../core/store/selectors';
import { DimensionFilterTranslation } from '../shared/dimension-filter/models';
import { FilterLayout } from '../shared/filter/filter-layout.enum';
import {
  Filter,
  FilterDimension,
  IdValue,
  SelectedFilter,
  TimePeriod,
} from '../shared/models';
import { getAllowedFilterDimensions } from '../shared/utils/utilities';

@Component({
  selector: 'ia-filter-section',
  templateUrl: './filter-section.component.html',
  standalone: false,
})
export class FilterSectionComponent implements OnInit {
  isExpanded = true;

  showBenchmarkFilter$: Observable<boolean>;
  availableDimensions$: Observable<IdValue[]>;
  activeDimension$: Observable<FilterDimension>;
  activeBenchmarkDimension$: Observable<FilterDimension>;
  selectedDimensionFilter$: Observable<Filter>;
  benchmarkDimensionFilter$: Observable<Filter>;
  selectedDimensionDataLoading$: Observable<boolean>;
  benchmarkDimensionDataLoading$: Observable<boolean>;
  selectedDimensionIdValue$: Observable<IdValue>;
  benchmarkDimensionIdValue$: Observable<IdValue>;
  timePeriods$: Observable<IdValue[]>;
  selectedTimePeriod$: Observable<TimePeriod>;
  selectedFromToMomentTimeRange$: Observable<{ from: Moment; to: Moment }>;
  selectedFilterValues$: Observable<{
    timeRange: string;
    value: string;
  }>;
  dimensionFilterTranslation$: Observable<DimensionFilterTranslation>;
  benchmarkDimensionFilterTranslation$: Observable<DimensionFilterTranslation>;
  timeRangeConstraints$: Observable<{ min: Moment; max: Moment }>;

  filterLayout = FilterLayout;

  constructor(
    private readonly store: Store,
    private readonly translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    this.showBenchmarkFilter$ = this.store.select(showBenchmarkFilter);
    this.availableDimensions$ = this.translocoService
      .selectTranslateObject('filters.dimension.availableDimensions')
      .pipe(
        map((translateObject) =>
          this.mapTranslationsToIdValues(translateObject)
        )
      );
    this.activeDimension$ = this.store.select(getSelectedDimension);
    this.timeRangeConstraints$ = this.store.select(
      getMomentTimeRangeConstraints
    );
    this.activeBenchmarkDimension$ = this.store.select(getBenchmarkDimension);
    this.selectedDimensionDataLoading$ = this.store.select(
      getSelectedDimensionDataLoading
    );
    this.benchmarkDimensionDataLoading$ = this.store.select(
      getBenchmarkDimensionDataLoading
    );
    this.selectedDimensionFilter$ = this.store.select(
      getSelectedDimensionFilter
    );
    this.benchmarkDimensionFilter$ = this.store.select(
      getBenchmarkDimensionFilter
    );
    this.timePeriods$ = this.store.select(getTimePeriods);
    this.selectedTimePeriod$ = this.store.select(getSelectedTimePeriod);
    this.selectedDimensionIdValue$ = this.store.select(
      getSelectedDimensionIdValue
    );
    this.benchmarkDimensionIdValue$ = this.store.select(getBenchmarkIdValue);
    this.selectedFromToMomentTimeRange$ = this.store.select(
      getSelectedMomentTimeRange
    );
    this.selectedFilterValues$ = this.store.select(getBeautifiedFilterValues);
    this.dimensionFilterTranslation$ =
      this.translocoService.selectTranslateObject('filters.dimension');
    this.benchmarkDimensionFilterTranslation$ =
      this.translocoService.selectTranslateObject('filters.benchmark');
  }

  onDimensionSelected(dimension: IdValue): void {
    const filterDimension = Object.entries(FilterDimension).find(
      ([_, value]) => value === dimension.id
    )?.[1];

    this.store.dispatch(loadFilterDimensionData({ filterDimension }));
  }

  onBenchmarkDimensionSelected(dimension: IdValue): void {
    const filterDimension = Object.entries(FilterDimension).find(
      ([_, value]) => value === dimension.id
    )?.[1];

    this.store.dispatch(loadFilterBenchmarkDimensionData({ filterDimension }));
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

  onDimensionAutocompleteInput(searchFor: string): void {
    this.store.dispatch(
      autocompleteDimensionData({
        filterDimension: FilterDimension.ORG_UNIT,
        searchFor,
      })
    );
  }

  onBenchmarkAutocompleteInput(searchFor: string): void {
    this.store.dispatch(
      autocompleteBenchmarkDimensionData({
        filterDimension: FilterDimension.ORG_UNIT,
        searchFor,
      })
    );
  }

  onBenchmarkOptionSelected(filter: SelectedFilter): void {
    this.store.dispatch(benchmarkFilterSelected({ filter }));
  }

  triggerDimensionDataClear(): void {
    this.store.dispatch(dimensionSelected());
  }

  mapTranslationsToIdValues(
    translations: Record<FilterDimension, string>
  ): IdValue[] {
    const filterDimensions = getAllowedFilterDimensions();

    return filterDimensions.map(
      (dimensionLevel) =>
        new IdValue(
          dimensionLevel.dimension,
          translations[dimensionLevel.dimension],
          dimensionLevel.level
        )
    );
  }
}
