import { Component, OnInit } from '@angular/core';

import { combineLatest, Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import {
  getOrgUnitsFilter,
  getSelectedOrgUnit,
  getSelectedTimePeriod,
  getSelectedTimeRange,
  getTimePeriods,
} from '../../core/store/selectors/filter/filter.selector';
import { ChartLegendItem } from '../../shared/charts/models/chart-legend-item.model';
import { DoughnutChartData } from '../../shared/charts/models/doughnut-chart-data.model';
import { SolidDoughnutChartConfig } from '../../shared/charts/models/solid-doughnut-chart-config.model';
import { FilterLayout } from '../../shared/filter/filter-layout.enum';
import {
  Filter,
  IdValue,
  SelectedFilter,
  TimePeriod,
} from '../../shared/models';
import { ReasonForLeavingRank } from '../models/reason-for-leaving-rank.model';
import {
  comparedFilterSelected,
  comparedTimePeriodSelected,
  loadComparedOrgUnits,
  resetCompareMode,
} from '../store/actions/reasons-and-counter-measures.actions';
import {
  getComparedOrgUnitsFilter,
  getComparedReasonsChartConfig,
  getComparedReasonsChartData,
  getComparedReasonsTableData,
  getComparedSelectedOrgUnit,
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
  orgUnitsFilter$: Observable<Filter>;
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

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.orgUnitsFilter$ = this.store.select(getOrgUnitsFilter);
    this.selectedOrgUnit$ = this.store.select(getSelectedOrgUnit);
    this.timePeriods$ = this.store.select(getTimePeriods);
    this.selectedTimePeriod$ = this.store.select(getSelectedTimePeriod);
    this.selectedTime$ = this.store.select(getSelectedTimeRange);

    this.reasonsChartData$ = this.store.select(getReasonsChartData);
    this.comparedReasonsChartData$ = this.store.select(
      getComparedReasonsChartData
    );
    this.chartData$ = combineLatest([
      this.reasonsChartData$,
      this.comparedReasonsChartData$,
    ]);

    this.reasonsChartLegend$ = this.store.select(getReasonsCombinedLegend);

    this.reasonsChartConfig$ = this.store.select(getReasonsChartConfig);
    this.reasonsTableData$ = this.store.select(getReasonsTableData);
    this.reasonsLoading$ = this.store.select(getReasonsLoading);

    this.comparedReasonsChartConfig$ = this.store.select(
      getComparedReasonsChartConfig
    );

    this.comparedOrgUnitsFilter$ = this.store.select(getComparedOrgUnitsFilter);
    this.comparedSelectedOrgUnit$ = this.store.select(
      getComparedSelectedOrgUnit
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

  comparedAutoCompleteOrgUnitsChange(searchFor: string): void {
    this.store.dispatch(loadComparedOrgUnits({ searchFor }));
  }

  resetCompareMode(): void {
    this.store.dispatch(resetCompareMode());
  }
}
