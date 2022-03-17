import { Component, OnInit } from '@angular/core';

import { combineLatest, Observable, tap } from 'rxjs';

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
import {
  Filter,
  IdValue,
  SelectedFilter,
  TimePeriod,
} from '../../shared/models';
import { getTimeRangeHint } from '../../shared/utils/utilities';
import { ReasonForLeavingRank } from '../models/reason-for-leaving-rank.model';
import {
  changeComparedFilter,
  changeComparedTimePeriod,
  changeComparedTimeRange,
  resetCompareMode,
} from '../store/actions/reasons-and-counter-measures.actions';
import {
  getComparedReasonsChartConfig,
  getComparedReasonsChartData,
  getComparedReasonsTableData,
  getComparedSelectedOrgUnit,
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
  timeRangeHintValue = 'time range';

  orgUnitsFilter$: Observable<Filter>;
  selectedOrgUnit$: Observable<string>;
  timePeriods$: Observable<IdValue[]>;
  selectedTimePeriod$: Observable<TimePeriod>;
  selectedTime$: Observable<string>;

  reasonsChartLegend$: Observable<ChartLegendItem[]>;

  chartData$: Observable<[DoughnutChartData[], DoughnutChartData[]]>;

  reasonsChartConfig$: Observable<SolidDoughnutChartConfig>;
  reasonsChartData$: Observable<DoughnutChartData[]>;
  reasonsTableData$: Observable<ReasonForLeavingRank[]>;
  reasonsLoading$: Observable<boolean>;

  comparedReasonsChartConfig$: Observable<SolidDoughnutChartConfig>;
  comparedReasonsChartData$: Observable<DoughnutChartData[]>;

  comparedReasonsTableData$: Observable<ReasonForLeavingRank[]>;

  comparedSelectedOrgUnit$: Observable<string>;
  comparedSelectedTimePeriod$: Observable<TimePeriod>;
  comparedSelectedTime$: Observable<string>;
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

    this.comparedSelectedOrgUnit$ = this.store
      .select(getComparedSelectedOrgUnit)
      .pipe(
        tap(
          (value) =>
            (this.comparedDisabledTimeRangeFilter = value === undefined)
        )
      );

    this.comparedSelectedTimePeriod$ = this.store
      .select(getComparedSelectedTimePeriod)
      .pipe(
        tap((timePeriod) => {
          this.timeRangeHintValue = getTimeRangeHint(timePeriod);
        })
      );
    this.comparedSelectedTime$ = this.store.select(
      getComparedSelectedTimeRange
    );
    this.comparedReasonsTableData$ = this.store.select(
      getComparedReasonsTableData
    );
  }

  orgUnitInvalid(orgUnitIsInvalid: boolean): void {
    this.comparedDisabledTimeRangeFilter = orgUnitIsInvalid;
  }

  comparedOptionSelected(comparedSelectedOrgUnit: SelectedFilter): void {
    this.store.dispatch(
      changeComparedFilter({
        comparedSelectedOrgUnit: comparedSelectedOrgUnit.id,
      })
    );
  }

  comparedTimePeriodSelected(comparedSelectedTimePeriod: IdValue): void {
    this.store.dispatch(
      changeComparedTimePeriod({
        comparedSelectedTimePeriod:
          comparedSelectedTimePeriod.id as unknown as TimePeriod,
      })
    );
  }

  comparedTimeRangeSelected(comparedSelectedTimeRange: string): void {
    this.store.dispatch(changeComparedTimeRange({ comparedSelectedTimeRange }));
  }

  resetCompareMode(): void {
    this.store.dispatch(resetCompareMode());
  }
}
