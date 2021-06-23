import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import { EChartsOption } from 'echarts';

import { AttritionSeries, Event } from '../shared/models';
import { Employee } from '../shared/models/employee.model';
import { DoughnutConfig } from './entries-exits/doughnut-chart/models/doughnut-config.model';
import { ResignedEmployee } from './models';
import {
  getAttritionOverTimeEvents,
  getAttritionOverTimeOverviewData,
  getEntryEmployees,
  getFluctuationRatesForChart,
  getIsLoadingAttritionOverTimeOverview,
  getIsLoadingFluctuationRatesForChart,
  getIsLoadingResignedEmployees,
  getIsLoadingUnforcedFluctuationRatesForChart,
  getLeaversDataForSelectedOrgUnit,
  getOverviewFluctuationEntriesCount,
  getOverviewFluctuationEntriesDoughnutConfig,
  getOverviewFluctuationExitsCount,
  getOverviewFluctuationExitsDoughnutConfig,
  getResignedEmployees,
  getUnforcedFluctuationRatesForChart,
} from './store/selectors/overview.selector';

@Component({
  selector: 'ia-overview',
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit {
  fluctuationChartData$: Observable<EChartsOption>;
  isFluctuationChartLoading$: Observable<boolean>;
  unforcedFluctuationChartData$: Observable<EChartsOption>;
  isUnforcedFluctuationChartLoading$: Observable<boolean>;

  attritionQuotaloading$: Observable<boolean>;
  events$: Observable<Event[]>;
  attritionData$: Observable<AttritionSeries>;
  entriesDoughnutConfig: DoughnutConfig;
  exitsDoughnutConfig$: Observable<DoughnutConfig>;
  entriesDoughnutConfig$: Observable<DoughnutConfig>;
  entriesCount$: Observable<number>;
  exitsCount$: Observable<number>;
  exitEmployees$: Observable<Employee[]>;
  entryEmployees$: Observable<Employee[]>;
  resignedEmployees$: Observable<ResignedEmployee[]>;
  resignedEmployeesLoading$: Observable<boolean>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
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

    this.resignedEmployees$ = this.store.select(getResignedEmployees);
    this.resignedEmployeesLoading$ = this.store.select(
      getIsLoadingResignedEmployees
    );
  }
}
