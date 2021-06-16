import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import { EChartsOption } from 'echarts';

import { AttritionSeries, Event } from '../shared/models';
import { Employee } from '../shared/models/employee.model';
import { DoughnutConfig } from './entries-exits/doughnut-chart/models/doughnut-config.model';
import { OverviewState } from './store';
import {
  getAttritionOverTimeEvents,
  getAttritionOverTimeOverviewData,
  getEntryEmployees,
  getFluctuationRatesForChart,
  getIsLoadingAttritionOverTimeOverview,
  getIsLoadingFluctuationRatesForChart,
  getIsLoadingUnforcedFluctuationRatesForChart,
  getLeaversDataForSelectedOrgUnit,
  getOverviewFluctuationEntriesCount,
  getOverviewFluctuationEntriesDoughnutConfig,
  getOverviewFluctuationExitsCount,
  getOverviewFluctuationExitsDoughnutConfig,
  getUnforcedFluctuationRatesForChart,
} from './store/selectors/overview.selector';

@Component({
  selector: 'ia-overview',
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit {
  public fluctuationChartData$: Observable<EChartsOption>;
  public isFluctuationChartLoading$: Observable<boolean>;
  public unforcedFluctuationChartData$: Observable<EChartsOption>;
  public isUnforcedFluctuationChartLoading$: Observable<boolean>;

  public attritionQuotaloading$: Observable<boolean>;
  public events$: Observable<Event[]>;
  public attritionData$: Observable<AttritionSeries>;
  public entriesDoughnutConfig: DoughnutConfig;
  public exitsDoughnutConfig$: Observable<DoughnutConfig>;
  public entriesDoughnutConfig$: Observable<DoughnutConfig>;
  public entriesCount$: Observable<number>;
  public exitsCount$: Observable<number>;
  public exitEmployees$: Observable<Employee[]>;
  public entryEmployees$: Observable<Employee[]>;

  constructor(private readonly store: Store<OverviewState>) {}

  public ngOnInit(): void {
    this.fluctuationChartData$ = this.store.select(getFluctuationRatesForChart);
    this.unforcedFluctuationChartData$ = this.store.select(
      getUnforcedFluctuationRatesForChart
    );
    this.isFluctuationChartLoading$ = this.store.select(
      getIsLoadingFluctuationRatesForChart
    );
    this.isUnforcedFluctuationChartLoading$ = this.store.select(
      getIsLoadingUnforcedFluctuationRatesForChart
    );
    this.attritionQuotaloading$ = this.store.select(
      getIsLoadingAttritionOverTimeOverview
    );
    this.events$ = this.store.select(getAttritionOverTimeEvents);
    this.attritionData$ = this.store.select(getAttritionOverTimeOverviewData);

    this.entriesDoughnutConfig$ = this.store.select(
      getOverviewFluctuationEntriesDoughnutConfig
    );

    this.exitsDoughnutConfig$ = this.store.select(
      getOverviewFluctuationExitsDoughnutConfig
    );

    this.entriesCount$ = this.store.select(getOverviewFluctuationEntriesCount);
    this.exitsCount$ = this.store.select(getOverviewFluctuationExitsCount);
    this.exitEmployees$ = this.store.select(getLeaversDataForSelectedOrgUnit);
    this.entryEmployees$ = this.store.select(getEntryEmployees);
  }
}
