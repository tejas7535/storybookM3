import { Component, OnInit } from '@angular/core';

import { combineLatest, map, Observable } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { EChartsOption, LineSeriesOption } from 'echarts';

import {
  getAreOpenApplicationsAvailable,
  getBeautifiedFilterValues,
  getSelectedDimension,
} from '../core/store/selectors/filter/filter.selector';
import { createFluctuationRateChartConfig } from '../shared/charts/line-chart/line-chart-utils';
import { DoughnutConfig } from '../shared/charts/models/doughnut-config.model';
import { EmployeeListDialogMetaFilters } from '../shared/dialogs/employee-list-dialog/models';
import { EmployeeListDialogMetaHeadings } from '../shared/dialogs/employee-list-dialog/models/employee-list-dialog-meta-headings.model';
import { AttritionSeries, EmployeeWithAction } from '../shared/models';
import {
  ExitEntryEmployeesResponse,
  FluctuationKpi,
  OpenApplication,
  ResignedEmployee,
} from './models';
import {
  loadAttritionOverTimeEmployees,
  loadOpenApplications,
  loadOverviewEntryEmployees,
  loadOverviewExitEmployees,
} from './store/actions/overview.action';
import {
  getAttritionOverTimeEmployeesData,
  getAttritionOverTimeEmployeesLoading,
  getAttritionOverTimeOverviewData,
  getBenchmarkFluctuationKpi,
  getBenchmarkFluctuationRatesForChart,
  getBenchmarkUnforcedFluctuationRatesForChart,
  getDimensionFluctuationKpi,
  getDimensionFluctuationRatesForChart,
  getDimensionUnforcedFluctuationRatesForChart,
  getIsLoadingAttritionOverTimeOverview,
  getIsLoadingBenchmarkFluctuationRates,
  getIsLoadingDimensionFluctuationRates,
  getIsLoadingDoughnutsConfig,
  getIsLoadingFluctuationRatesForChart,
  getIsLoadingOpenApplications,
  getIsLoadingOpenApplicationsCount,
  getIsLoadingResignedEmployees,
  getOpenApplications,
  getOpenApplicationsCount,
  getOverviewEntryEmployees,
  getOverviewEntryEmployeesLoading,
  getOverviewExitEmployees,
  getOverviewExitEmployeesLoading,
  getOverviewExternalExitEmployees,
  getOverviewExternalUnforcedExitEmployees,
  getOverviewFluctuationEntriesCount,
  getOverviewFluctuationEntriesDoughnutConfig,
  getOverviewFluctuationExitsCount,
  getOverviewFluctuationExitsDoughnutConfig,
  getOverviewFluctuationTotalEmployeesCount,
  getResignedEmployees,
  getResignedEmployeesCount,
  getResignedEmployeesSyncOn,
} from './store/selectors/overview.selector';

@Component({
  selector: 'ia-overview',
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit {
  fluctuationRatesChartConfig: EChartsOption;
  unforcedFluctuationRatesChartConfig: EChartsOption;
  fluctuationChartData$: Observable<LineSeriesOption[]>;
  benchmarkfluctuationChartData$: Observable<LineSeriesOption[]>;
  benchmarkUnforcedFluctuationChartData$: Observable<LineSeriesOption[]>;
  unforcedFluctuationChartData$: Observable<LineSeriesOption[]>;
  isFluctuationChartLoading$: Observable<boolean>;
  dimensionFluctuationKpi$: Observable<FluctuationKpi>;
  isDimensionFluctuationKpiLoading$: Observable<boolean>;
  benchmarkFluctuationKpi$: Observable<FluctuationKpi>;
  isBenchmarkFluctuationKpiLoading$: Observable<boolean>;
  externalExitEmployees$: Observable<EmployeeWithAction[]>;
  externalUnforcedExitEmployees$: Observable<EmployeeWithAction[]>;

  leaversListDialogMetaHeadings$: Observable<EmployeeListDialogMetaHeadings>;
  newJoinersListDialogMetaHeadings$: Observable<EmployeeListDialogMetaHeadings>;
  unforcedLeaversListDialogMetaHeadings$: Observable<EmployeeListDialogMetaHeadings>;
  totalFluctuationListDialogMetaHeadings$: Observable<EmployeeListDialogMetaHeadings>;
  unforcedFluctuationListDialogMetaHeadings$: Observable<EmployeeListDialogMetaHeadings>;

  attritionRateLoading$: Observable<boolean>;
  events$: Observable<Event[]>;
  attritionData$: Observable<AttritionSeries>;
  attritionEmployeesData$: Observable<ExitEntryEmployeesResponse>;
  attritionEmployeesLoading$: Observable<boolean>;

  dimensionHint$: Observable<string>;
  exitsDoughnutConfig$: Observable<DoughnutConfig>;
  entriesDoughnutConfig$: Observable<DoughnutConfig>;
  chartData$: Observable<[DoughnutConfig, DoughnutConfig]>;

  isLoadingDoughnutsConfig$: Observable<boolean>;
  entriesCount$: Observable<number>;
  exitsCount$: Observable<number>;
  exitEmployees$: Observable<EmployeeWithAction[]>;
  entryEmployees$: Observable<EmployeeWithAction[]>;
  exitEmployeesLoading$: Observable<boolean>;
  entryEmployeesLoading$: Observable<boolean>;
  totalEmployeesCount$: Observable<number>;

  resignedEmployees$: Observable<ResignedEmployee[]>;
  resignedEmployeesCount$: Observable<number>;
  resignedEmployeesSyncOn$: Observable<string>;
  resignedEmployeesLoading$: Observable<boolean>;

  areOpenApplicationsAvailable$: Observable<boolean>;

  openApplications$: Observable<OpenApplication[]>;
  openApplicationsLoading$: Observable<boolean>;

  openApplicationsCount$: Observable<number>;
  openApplicationsCountLoading$: Observable<boolean>;

  beautifiedFilters$: Observable<EmployeeListDialogMetaFilters>;

  constructor(
    private readonly store: Store,
    private readonly translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    this.loadFluctuationData();
    this.loadWorkforceBalanceData();
    this.loadResignedEmployeesData();
    this.loadOpenApplicationsData();
    this.loadAttritionRateData();

    this.totalFluctuationListDialogMetaHeadings$ = this.translocoService
      .selectTranslate(
        'employeeListDialog.title.totalFluctuation',
        {},
        'overview'
      )
      .pipe(
        map(
          (title: string) =>
            new EmployeeListDialogMetaHeadings(title, 'person_add_disabled')
        )
      );
    this.unforcedFluctuationListDialogMetaHeadings$ = this.translocoService
      .selectTranslate(
        'employeeListDialog.title.unforcedFluctuation',
        {},
        'overview'
      )
      .pipe(
        map(
          (title: string) =>
            new EmployeeListDialogMetaHeadings(title, 'person_add_disabled')
        )
      );
    this.leaversListDialogMetaHeadings$ = this.translocoService
      .selectTranslate('employeeListDialog.title.leavers', {}, 'overview')
      .pipe(
        map(
          (title: string) =>
            new EmployeeListDialogMetaHeadings(title, 'person_add_disabled')
        )
      );
    this.unforcedLeaversListDialogMetaHeadings$ = this.translocoService
      .selectTranslate(
        'employeeListDialog.title.unforcedLeavers',
        {},
        'overview'
      )
      .pipe(
        map(
          (title: string) =>
            new EmployeeListDialogMetaHeadings(title, 'person_add_disabled')
        )
      );
    this.newJoinersListDialogMetaHeadings$ = this.translocoService
      .selectTranslate('employeeListDialog.title.newJoiners', {}, 'overview')
      .pipe(
        map(
          (title: string) =>
            new EmployeeListDialogMetaHeadings(title, 'person_add')
        )
      );
    this.beautifiedFilters$ = this.store.select(getBeautifiedFilterValues);
  }

  loadFluctuationData() {
    const percentageSign = '%';
    this.fluctuationRatesChartConfig =
      createFluctuationRateChartConfig(percentageSign);
    this.unforcedFluctuationRatesChartConfig =
      createFluctuationRateChartConfig(percentageSign);
    this.isDimensionFluctuationKpiLoading$ = this.store.select(
      getIsLoadingDimensionFluctuationRates
    );
    this.isBenchmarkFluctuationKpiLoading$ = this.store.select(
      getIsLoadingBenchmarkFluctuationRates
    );
    this.fluctuationChartData$ = this.store.select(
      getDimensionFluctuationRatesForChart
    );
    this.unforcedFluctuationChartData$ = this.store.select(
      getDimensionUnforcedFluctuationRatesForChart
    );
    this.benchmarkfluctuationChartData$ = this.store.select(
      getBenchmarkFluctuationRatesForChart
    );
    this.benchmarkUnforcedFluctuationChartData$ = this.store.select(
      getBenchmarkUnforcedFluctuationRatesForChart
    );
    this.isFluctuationChartLoading$ = this.store.select(
      getIsLoadingFluctuationRatesForChart
    );
    this.dimensionFluctuationKpi$ = this.store.select(
      getDimensionFluctuationKpi
    );
    this.externalExitEmployees$ = this.store.select(
      getOverviewExternalExitEmployees
    );
    this.benchmarkFluctuationKpi$ = this.store.select(
      getBenchmarkFluctuationKpi
    );
    this.externalUnforcedExitEmployees$ = this.store.select(
      getOverviewExternalUnforcedExitEmployees
    );
  }

  loadWorkforceBalanceData() {
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
    this.exitEmployees$ = this.store.select(getOverviewExitEmployees);
    this.exitEmployeesLoading$ = this.store.select(
      getOverviewExitEmployeesLoading
    );
    this.entryEmployees$ = this.store.select(getOverviewEntryEmployees);
    this.entryEmployeesLoading$ = this.store.select(
      getOverviewEntryEmployeesLoading
    );
    this.totalEmployeesCount$ = this.store.select(
      getOverviewFluctuationTotalEmployeesCount
    );

    const availableDimensions$ = this.translocoService.selectTranslateObject(
      'filters.dimension.availableDimensions'
    );
    const selectedDimensions$ = this.store.select(getSelectedDimension);

    this.dimensionHint$ = combineLatest([
      selectedDimensions$,
      availableDimensions$,
    ]).pipe(
      map(([dimension, translateObject]) =>
        translateObject[dimension]?.toLocaleLowerCase()
      )
    );
  }

  loadResignedEmployeesData() {
    this.resignedEmployees$ = this.store.select(getResignedEmployees);
    this.resignedEmployeesLoading$ = this.store.select(
      getIsLoadingResignedEmployees
    );
    this.resignedEmployeesCount$ = this.store.select(getResignedEmployeesCount);
    this.resignedEmployeesSyncOn$ = this.store.select(
      getResignedEmployeesSyncOn
    );
  }

  loadOpenApplicationsData() {
    this.areOpenApplicationsAvailable$ = this.store.select(
      getAreOpenApplicationsAvailable
    );
    this.openApplications$ = this.store.select(getOpenApplications);
    this.openApplicationsLoading$ = this.store.select(
      getIsLoadingOpenApplications
    );
    this.openApplicationsCount$ = this.store.select(getOpenApplicationsCount);
    this.openApplicationsCountLoading$ = this.store.select(
      getIsLoadingOpenApplicationsCount
    );
  }

  loadAttritionRateData() {
    this.attritionRateLoading$ = this.store.select(
      getIsLoadingAttritionOverTimeOverview
    );
    this.attritionData$ = this.store.select(getAttritionOverTimeOverviewData);
    this.attritionEmployeesData$ = this.store.select(
      getAttritionOverTimeEmployeesData
    );
    this.attritionEmployeesLoading$ = this.store.select(
      getAttritionOverTimeEmployeesLoading
    );
  }

  triggerLoadExitEmployees() {
    this.store.dispatch(loadOverviewExitEmployees());
  }

  triggerLoadEntryEmployees() {
    this.store.dispatch(loadOverviewEntryEmployees());
  }

  triggerLoadOpenApplications() {
    this.store.dispatch(loadOpenApplications());
  }

  triggerAttritionOverTimeEmployees(timeRange: string) {
    this.store.dispatch(loadAttritionOverTimeEmployees({ timeRange }));
  }
}
