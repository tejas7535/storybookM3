import { Component, OnInit } from '@angular/core';

import { combineLatest, map, Observable } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import {
  getSelectedDimension,
  getSelectedDimensionIdValue,
  getSelectedTimePeriod,
  getSelectedTimeRange,
  getTimePeriods,
} from '../../core/store/selectors';
import { ChartLegendItem } from '../../shared/charts/models/chart-legend-item.model';
import { DoughnutChartData } from '../../shared/charts/models/doughnut-chart-data.model';
import { SolidDoughnutChartConfig } from '../../shared/charts/models/solid-doughnut-chart-config.model';
import { FILTER_DIMENSIONS } from '../../shared/constants';
import { FilterLayout } from '../../shared/filter/filter-layout.enum';
import {
  Filter,
  FilterDimension,
  IdValue,
  SelectedFilter,
  TimePeriod,
} from '../../shared/models';
import { ReasonForLeavingRank } from '../models/reason-for-leaving-rank.model';
import {
  comparedFilterSelected,
  comparedTimePeriodSelected,
  loadComparedFilterDimensionData,
  loadComparedOrgUnits,
  resetCompareMode,
} from '../store/actions/reasons-and-counter-measures.actions';
import {
  getComparedOrgUnitsFilter,
  getComparedReasonsChartConfig,
  getComparedReasonsChartData,
  getComparedReasonsTableData,
  getComparedSelectedDimension,
  getComparedSelectedDimensionFilter,
  getComparedSelectedDimensionIdValue,
  getComparedSelectedOrgUnitLoading,
  getComparedSelectedTimePeriod,
  getComparedSelectedTimeRange,
  getReasonsChartConfig,
  getReasonsChartData,
  getReasonsCombinedLegend,
  getReasonsLoading,
  getReasonsTableData,
} from '../store/selectors/reasons-and-counter-measures.selector';

@Component({
  selector: 'ia-reasons-for-leaving',
  templateUrl: './reasons-for-leaving.component.html',
})
export class ReasonsForLeavingComponent implements OnInit {
  availableDimensions$: Observable<IdValue[]>;
  activeDimension$: Observable<FilterDimension>;

  selectedOrgUnit$: Observable<IdValue>;
  timePeriods$: Observable<IdValue[]>;
  selectedTimePeriod$: Observable<TimePeriod>;
  selectedTime$: Observable<IdValue>;

  reasonsChartLegend$: Observable<ChartLegendItem[]>;

  chartData$: Observable<[DoughnutChartData[], DoughnutChartData[]]>;

  reasonsChartConfig$: Observable<SolidDoughnutChartConfig>;
  reasonsChartData$: Observable<DoughnutChartData[]>;
  reasonsTableData$: Observable<ReasonForLeavingRank[]>;
  reasonsLoading$: Observable<boolean>;

  comparedActiveDimension$: Observable<FilterDimension>;
  comparedDimensionFilter$: Observable<Filter>;
  comparedReasonsChartConfig$: Observable<SolidDoughnutChartConfig>;
  comparedReasonsChartData$: Observable<DoughnutChartData[]>;

  comparedReasonsTableData$: Observable<ReasonForLeavingRank[]>;

  comparedOrgUnitsFilter$: Observable<Filter>;
  comparedSelectedOrgUnit$: Observable<IdValue>;
  comparedSelectedOrgUnitLoading$: Observable<boolean>;
  comparedSelectedTimePeriod$: Observable<TimePeriod>;
  comparedSelectedTime$: Observable<IdValue>;

  filterLayout = FilterLayout;
  comparedDisabledTimeRangeFilter: boolean;

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
    this.selectedOrgUnit$ = this.store.select(getSelectedDimensionIdValue);
    this.timePeriods$ = this.store.select(getTimePeriods);
    this.selectedTimePeriod$ = this.store.select(getSelectedTimePeriod);
    this.selectedTime$ = this.store.select(getSelectedTimeRange);

    this.reasonsChartData$ = this.store.select(getReasonsChartData);
    this.comparedReasonsChartData$ = this.store.select(
      getComparedReasonsChartData
    );
    this.reasonsTableData$ = this.store.select(getReasonsTableData);
    this.chartData$ = combineLatest([
      this.reasonsChartData$,
      this.comparedReasonsChartData$,
    ]);

    this.reasonsChartLegend$ = this.store.select(getReasonsCombinedLegend);

    this.reasonsChartConfig$ = this.store.select(getReasonsChartConfig);
    this.reasonsLoading$ = this.store.select(getReasonsLoading);

    this.comparedReasonsChartConfig$ = this.store.select(
      getComparedReasonsChartConfig
    );
    this.comparedActiveDimension$ = this.store.select(
      getComparedSelectedDimension
    );
    this.comparedDimensionFilter$ = this.store.select(
      getComparedSelectedDimensionFilter
    );

    this.comparedOrgUnitsFilter$ = this.store.select(getComparedOrgUnitsFilter);
    this.comparedSelectedOrgUnit$ = this.store.select(
      getComparedSelectedDimensionIdValue
    );
    this.comparedSelectedOrgUnitLoading$ = this.store.select(
      getComparedSelectedOrgUnitLoading
    );
    this.comparedSelectedTimePeriod$ = this.store.select(
      getComparedSelectedTimePeriod
    );
    this.comparedSelectedTime$ = this.store.select(
      getComparedSelectedTimeRange
    );
    this.comparedReasonsTableData$ = this.store.select(
      getComparedReasonsTableData
    );
  }

  comparedFilterSelected(filter: SelectedFilter): void {
    this.store.dispatch(comparedFilterSelected({ filter }));
  }

  comparedTimePeriodSelected(timePeriod: TimePeriod): void {
    this.store.dispatch(
      comparedTimePeriodSelected({
        timePeriod,
      })
    );
  }

  comparedDimensionSelected(dimension: IdValue): void {
    const filterDimension = Object.entries(FilterDimension).find(
      ([_, value]) => value === dimension.id
    )?.[1];

    this.store.dispatch(loadComparedFilterDimensionData({ filterDimension }));
  }

  comparedAutoCompleteOrgUnitsChange(searchFor: string): void {
    this.store.dispatch(
      loadComparedOrgUnits({
        searchFor,
      })
    );
  }

  resetCompareMode(): void {
    this.store.dispatch(resetCompareMode());
  }

  getOrgUnitShortName(name: string): string {
    return name?.split('(')[0].trim();
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
