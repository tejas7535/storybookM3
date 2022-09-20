import { Component, OnInit } from '@angular/core';

import { combineLatest, map, Observable } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { EChartsOption } from 'echarts';

import { getSelectedDimension } from '../core/store/selectors/filter/filter.selector';
import { DoughnutConfig } from '../shared/charts/models/doughnut-config.model';
import { EmployeeListDialogMetaHeadings } from '../shared/employee-list-dialog/employee-list-dialog-meta-headings.model';
import { AttritionSeries, EmployeeWithAction } from '../shared/models';
import { FluctuationKpi, OpenApplication, ResignedEmployee } from './models';
import {
  loadOverviewEntryEmployees,
  loadOverviewExitEmployees,
} from './store/actions/overview.action';
import {
  getAttritionOverTimeOverviewData,
  getFluctuationRatesForChart,
  getIsLoadingAttritionOverTimeOverview,
  getIsLoadingDoughnutsConfig,
  getIsLoadingFluctuationRatesForChart,
  getIsLoadingOpenApplications,
  getIsLoadingResignedEmployees,
  getOpenApplications,
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
  getOverviewFluctuationKpi,
  getOverviewFluctuationTotalEmployeesCount,
  getOverviewUnforcedFluctuationKpi,
  getResignedEmployees,
  getResignedEmployeesCount,
  getUnforcedFluctuationRatesForChart,
} from './store/selectors/overview.selector';

@Component({
  selector: 'ia-overview',
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit {
  fluctuationChartData$: Observable<EChartsOption>;
  unforcedFluctuationChartData$: Observable<EChartsOption>;
  isFluctuationChartLoading$: Observable<boolean>;
  fluctuationKpi$: Observable<FluctuationKpi>;
  unforcedFluctuationKpi$: Observable<FluctuationKpi>;
  externalExitEmployees$: Observable<EmployeeWithAction[]>;
  externalUnforcedExitEmployees$: Observable<EmployeeWithAction[]>;

  employeeListDialogMetaHeadings$: Observable<EmployeeListDialogMetaHeadings>;

  attritionRateLoading$: Observable<boolean>;
  events$: Observable<Event[]>;
  attritionData$: Observable<AttritionSeries>;

  dimensionHint$: Observable<string>;
  exitsDoughnutConfig$: Observable<DoughnutConfig>;
  entriesDoughnutConfig$: Observable<DoughnutConfig>;
  chartData$: Observable<[DoughnutConfig, DoughnutConfig]>;

  isLoadingDoughnutsConfig$: Observable<boolean>;
  entriesCount$: Observable<number>;
  exitsCount$: Observable<number>;
  realEntriesCount$: Observable<number>;
  realExitsCount$: Observable<number>;
  exitEmployees$: Observable<EmployeeWithAction[]>;
  entryEmployees$: Observable<EmployeeWithAction[]>;
  exitEmployeesLoading$: Observable<boolean>;
  entryEmployeesLoading$: Observable<boolean>;
  totalEmployeesCount$: Observable<number>;

  resignedEmployees$: Observable<ResignedEmployee[]>;
  resignedEmployeesCount$: Observable<number>;
  resignedEmployeesLoading$: Observable<boolean>;

  openApplications$: Observable<OpenApplication[]>;
  openApplicationsLoading$: Observable<boolean>;

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
    this.unforcedFluctuationChartData$ = this.store.select(
      getUnforcedFluctuationRatesForChart
    );
    this.isFluctuationChartLoading$ = this.store.select(
      getIsLoadingFluctuationRatesForChart
    );
    this.fluctuationKpi$ = this.store.select(getOverviewFluctuationKpi);
    this.externalExitEmployees$ = this.store.select(
      getOverviewExternalExitEmployees
    );
    this.unforcedFluctuationKpi$ = this.store.select(
      getOverviewUnforcedFluctuationKpi
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
    this.attritionData$ = this.store.select(getAttritionOverTimeOverviewData);
  }

  triggerLoadExitEmployees() {
    this.store.dispatch(loadOverviewExitEmployees());
  }

  triggerLoadEntryEmployees() {
    this.store.dispatch(loadOverviewEntryEmployees());
  }
}
