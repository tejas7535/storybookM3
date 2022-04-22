import { Component, OnInit } from '@angular/core';

import { combineLatest, map, Observable } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { EChartsOption } from 'echarts';

import { DoughnutConfig } from '../shared/charts/models/doughnut-config.model';
import { EmployeeListDialogMetaHeadings } from '../shared/employee-list-dialog/employee-list-dialog-meta-headings.model';
import { AttritionSeries, Employee, Event } from '../shared/models';
import { FluctuationKpi, OpenApplication, ResignedEmployee } from './models';
import {
  getAttritionOverTimeEvents,
  getAttritionOverTimeOverviewData,
  getEntryEmployees,
  getFluctuationRatesForChart,
  getIsLoadingAttritionOverTimeOverview,
  getIsLoadingDoughnutsConfig,
  getIsLoadingFluctuationRatesForChart,
  getIsLoadingOpenApplications,
  getIsLoadingResignedEmployees,
  getIsLoadingUnforcedFluctuationRatesForChart,
  getExitEmployees,
  getOpenApplications,
  getOverviewFluctuationEntriesCount,
  getOverviewFluctuationEntriesDoughnutConfig,
  getOverviewFluctuationExitsCount,
  getOverviewFluctuationExitsDoughnutConfig,
  getOverviewFluctuationKpi,
  getOverviewUnforcedFluctuationKpi,
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

  employeeListDialogMetaHeadings$: Observable<EmployeeListDialogMetaHeadings>;

  unforcedFluctuationChartData$: Observable<EChartsOption>;
  isUnforcedFluctuationChartLoading$: Observable<boolean>;
  unforcedFluctuationKpi$: Observable<FluctuationKpi>;

  attritionRateLoading$: Observable<boolean>;
  events$: Observable<Event[]>;
  attritionData$: Observable<AttritionSeries>;

  exitsDoughnutConfig$: Observable<DoughnutConfig>;
  entriesDoughnutConfig$: Observable<DoughnutConfig>;
  chartData$: Observable<[DoughnutConfig, DoughnutConfig]>;

  isLoadingDoughnutsConfig$: Observable<boolean>;
  entriesCount$: Observable<number>;
  exitsCount$: Observable<number>;
  exitEmployees$: Observable<Employee[]>;
  entryEmployees$: Observable<Employee[]>;

  resignedEmployees$: Observable<ResignedEmployee[]>;
  resignedEmployeesLoading$: Observable<boolean>;

  openApplications$: Observable<OpenApplication[]>;
  openApplicationsLoading$: Observable<boolean>;

  constructor(
    private readonly store: Store,
    private readonly translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    this.loadFluctuationData();
    this.loadUnforcedFluctuationData();
    this.loadEntriesAndExitsData();
    this.loadResignedEmployeesData();
    this.loadOpenApplicationsData();
    this.loadAttritionRateData();

    this.employeeListDialogMetaHeadings$ = this.translocoService
      .selectTranslate('employeeListDialog.contentTitle', {}, 'overview')
      .pipe(
        map(
          (contentTitle: string) =>
            new EmployeeListDialogMetaHeadings(undefined, contentTitle)
        )
      );
  }

  loadFluctuationData() {
    this.fluctuationChartData$ = this.store.select(getFluctuationRatesForChart);
    this.isFluctuationChartLoading$ = this.store.select(
      getIsLoadingFluctuationRatesForChart
    );
    this.fluctuationKpi$ = this.store.select(getOverviewFluctuationKpi);
  }

  loadUnforcedFluctuationData() {
    this.unforcedFluctuationChartData$ = this.store.select(
      getUnforcedFluctuationRatesForChart
    );
    this.isUnforcedFluctuationChartLoading$ = this.store.select(
      getIsLoadingUnforcedFluctuationRatesForChart
    );
    this.unforcedFluctuationKpi$ = this.store.select(
      getOverviewUnforcedFluctuationKpi
    );
  }

  loadEntriesAndExitsData() {
    this.entriesDoughnutConfig$ = this.store.select(
      getOverviewFluctuationEntriesDoughnutConfig
    );
    this.isLoadingDoughnutsConfig$ = this.store.select(
      getIsLoadingDoughnutsConfig
    );

    this.exitsDoughnutConfig$ = this.store.select(
      getOverviewFluctuationExitsDoughnutConfig
    );

    this.chartData$ = combineLatest([
      this.entriesDoughnutConfig$,
      this.exitsDoughnutConfig$,
    ]);

    this.entriesCount$ = this.store.select(getOverviewFluctuationEntriesCount);
    this.exitsCount$ = this.store.select(getOverviewFluctuationExitsCount);
    this.exitEmployees$ = this.store.select(getExitEmployees);
    this.entryEmployees$ = this.store.select(getEntryEmployees);
  }

  loadResignedEmployeesData() {
    this.resignedEmployees$ = this.store.select(getResignedEmployees);
    this.resignedEmployeesLoading$ = this.store.select(
      getIsLoadingResignedEmployees
    );
  }

  loadOpenApplicationsData() {
    this.openApplications$ = this.store.select(getOpenApplications);
    this.openApplicationsLoading$ = this.store.select(
      getIsLoadingOpenApplications
    );
  }

  loadAttritionRateData() {
    this.attritionRateLoading$ = this.store.select(
      getIsLoadingAttritionOverTimeOverview
    );
    this.events$ = this.store.select(getAttritionOverTimeEvents);
    this.attritionData$ = this.store.select(getAttritionOverTimeOverviewData);
  }
}
