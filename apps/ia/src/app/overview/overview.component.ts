import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import { EChartsOption } from 'echarts';

import { AttritionSeries, Event, FluctuationKpi } from '../shared/models';
import { Employee } from '../shared/models/employee.model';
import { DoughnutConfig } from './entries-exits/doughnut-chart/models/doughnut-config.model';
import { ResignedEmployee } from './models';
import {
  getAttritionOverTimeEvents,
  getAttritionOverTimeOverviewData,
  getEntryEmployees,
  getFluctuationRatesForChart,
  getIsLoadingAttritionOverTimeOverview,
  getIsLoadingDoughnutsConfig,
  getIsLoadingFluctuationRatesForChart,
  getIsLoadingResignedEmployees,
  getIsLoadingUnforcedFluctuationRatesForChart,
  getLeaversDataForSelectedOrgUnit,
  getOveriviewUnforcedFluctuationKpi,
  getOverviewFluctuationEntriesCount,
  getOverviewFluctuationEntriesDoughnutConfig,
  getOverviewFluctuationExitsCount,
  getOverviewFluctuationExitsDoughnutConfig,
  getOverviewFluctuationKpi,
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
  fluctuationKpi$: Observable<FluctuationKpi>;

  unforcedFluctuationChartData$: Observable<EChartsOption>;
  isUnforcedFluctuationChartLoading$: Observable<boolean>;
  unforcedFluctuationKpi$: Observable<FluctuationKpi>;

  attritionQuotaloading$: Observable<boolean>;
  events$: Observable<Event[]>;
  attritionData$: Observable<AttritionSeries>;

  exitsDoughnutConfig$: Observable<DoughnutConfig>;
  entriesDoughnutConfig$: Observable<DoughnutConfig>;
  isLoadingDoughnutsConfig$: Observable<boolean>;
  entriesCount$: Observable<number>;
  exitsCount$: Observable<number>;
  exitEmployees$: Observable<Employee[]>;
  entryEmployees$: Observable<Employee[]>;

  resignedEmployees$: Observable<ResignedEmployee[]>;
  resignedEmployeesLoading$: Observable<boolean>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.loadFluctuationData();
    this.loadUnforcedFluctuationData();
    this.loadEntriesAndExitsData();
    this.loadResignedEmployeesData();
    this.loadAttritionQuotaData();
  }

  private loadFluctuationData() {
    this.fluctuationChartData$ = this.store.select(getFluctuationRatesForChart);
    this.isFluctuationChartLoading$ = this.store.select(
      getIsLoadingFluctuationRatesForChart
    );
    this.fluctuationKpi$ = this.store.select(getOverviewFluctuationKpi);
  }

  private loadUnforcedFluctuationData() {
    this.unforcedFluctuationChartData$ = this.store.select(
      getUnforcedFluctuationRatesForChart
    );
    this.isUnforcedFluctuationChartLoading$ = this.store.select(
      getIsLoadingUnforcedFluctuationRatesForChart
    );
    this.unforcedFluctuationKpi$ = this.store.select(
      getOveriviewUnforcedFluctuationKpi
    );
  }

  private loadEntriesAndExitsData() {
    this.entriesDoughnutConfig$ = this.store.select(
      getOverviewFluctuationEntriesDoughnutConfig
    );
    this.isLoadingDoughnutsConfig$ = this.store.select(
      getIsLoadingDoughnutsConfig
    );

    this.exitsDoughnutConfig$ = this.store.select(
      getOverviewFluctuationExitsDoughnutConfig
    );

    this.entriesCount$ = this.store.select(getOverviewFluctuationEntriesCount);
    this.exitsCount$ = this.store.select(getOverviewFluctuationExitsCount);
    this.exitEmployees$ = this.store.select(getLeaversDataForSelectedOrgUnit);
    this.entryEmployees$ = this.store.select(getEntryEmployees);
  }

  private loadResignedEmployeesData() {
    this.resignedEmployees$ = this.store.select(getResignedEmployees);
    this.resignedEmployeesLoading$ = this.store.select(
      getIsLoadingResignedEmployees
    );
  }

  private loadAttritionQuotaData() {
    this.attritionQuotaloading$ = this.store.select(
      getIsLoadingAttritionOverTimeOverview
    );
    this.events$ = this.store.select(getAttritionOverTimeEvents);
    this.attritionData$ = this.store.select(getAttritionOverTimeOverviewData);
  }
}
