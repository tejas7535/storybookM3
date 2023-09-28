import { createSelector } from '@ngrx/store';

import {
  getBenchmarkIdValue,
  getSelectedBenchmarkValueShort,
  getSelectedDimensionIdValue,
  getSelectedDimensionValueShort,
} from '../../../core/store/selectors';
import { createFluctuationRateChartSerie } from '../../../shared/charts/line-chart/line-chart-utils';
import {
  ActionType,
  AttritionOverTime,
  EmployeeWithAction,
  IdValue,
  LeavingType,
} from '../../../shared/models';
import { getPercentageValueSigned } from '../../../shared/utils/utilities';
import {
  FluctuationKpi,
  FluctuationRate,
  FluctuationRatesChartData,
  OverviewWorkforceBalanceMeta,
} from '../../models';
import { OverviewState, selectOverviewState } from '..';
import * as utils from './overview-selector-utils';

const DIMENSION_SERIE_ID = 'dimension';
const BENCHMARK_SERIE_ID = 'benchmark';

export const getIsLoadingAttritionOverTimeOverview = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.attritionOverTime.loading
);

const getAttritionOverTime = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.attritionOverTime?.data
);

export const getAttritionOverTimeOverviewData = createSelector(
  getAttritionOverTime,
  (attritionOverTime: AttritionOverTime) => attritionOverTime?.data
);

export const getAttritionOverTimeEmployeesData = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.attritionOverTimeEmployees.data
);

export const getAttritionOverTimeEmployeesLoading = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.attritionOverTimeEmployees.loading
);

export const getIsLoadingDimensionFluctuationRates = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.fluctuationRates.dimension.loading
);

export const getIsLoadingBenchmarkFluctuationRates = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.fluctuationRates.benchmark.loading
);

export const getDimensionFluctuationRates = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.fluctuationRates.dimension.data
);

export const getBenchmarkFluctuationRates = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.fluctuationRates.benchmark.data
);

export const getOverviewExitEmployees = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.exitEmployees.data?.employees
);

export const getOverviewExternalExitEmployees = createSelector(
  getOverviewExitEmployees,
  (employees: EmployeeWithAction[]) =>
    employees?.filter((e) => e.actionType === ActionType.EXTERNAL)
);

export const getOverviewExternalUnforcedExitEmployees = createSelector(
  getOverviewExternalExitEmployees,
  (employees: EmployeeWithAction[]) =>
    employees?.filter((e) => e.reasonForLeaving === LeavingType.UNFORCED)
);

export const getOverviewExitEmployeesLoading = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.exitEmployees.loading
);

export const getOverviewEntryEmployees = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.entryEmployees.data?.employees
);

export const getOverviewEntryEmployeesLoading = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.entryEmployees.loading
);

export const getWorkforceBalanceMeta = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.workforceBalanceMeta.dimension.data
);

export const getBenchmarkFluctuationKpi = createSelector(
  getBenchmarkFluctuationRates,
  getBenchmarkIdValue,
  (fluctuationRates: FluctuationRate, dimension: IdValue) =>
    fluctuationRates
      ? new FluctuationKpi(
          getPercentageValueSigned(fluctuationRates.fluctuationRate),
          getPercentageValueSigned(fluctuationRates.unforcedFluctuationRate),
          dimension?.value
        )
      : undefined
);

export const getDimensionFluctuationKpi = createSelector(
  getDimensionFluctuationRates,
  getWorkforceBalanceMeta,
  getSelectedDimensionIdValue,
  (
    fluctuationRates: FluctuationRate,
    workforceBalanceMeta: OverviewWorkforceBalanceMeta,
    dimension: IdValue
  ) =>
    fluctuationRates
      ? new FluctuationKpi(
          getPercentageValueSigned(fluctuationRates.fluctuationRate),
          getPercentageValueSigned(fluctuationRates.unforcedFluctuationRate),
          dimension?.value,
          workforceBalanceMeta?.externalExitCount,
          workforceBalanceMeta?.externalUnforcedExitCount
        )
      : undefined
);

export const getIsLoadingDoughnutsConfig = createSelector(
  selectOverviewState,
  (overviewState: OverviewState) =>
    overviewState.workforceBalanceMeta.dimension.loading
);

export const getInternalExitCount = createSelector(
  selectOverviewState,
  (overviewState: OverviewState) =>
    overviewState.workforceBalanceMeta.dimension.data?.internalExitCount
);

export const getExternalExitCount = createSelector(
  selectOverviewState,
  (overviewState: OverviewState) =>
    overviewState.workforceBalanceMeta.dimension.data?.externalExitCount
);

export const getInternalEntryCount = createSelector(
  selectOverviewState,
  (overviewState: OverviewState) =>
    overviewState.workforceBalanceMeta.dimension.data?.internalEntryCount
);

export const getExternalEntryCount = createSelector(
  selectOverviewState,
  (overviewState: OverviewState) =>
    overviewState.workforceBalanceMeta.dimension.data?.externalEntryCount
);

export const getOverviewFluctuationExitsDoughnutConfig = createSelector(
  getInternalExitCount,
  getExternalExitCount,
  (internalExitCount: number, externalExitCount: number) =>
    utils.createDoughnutConfig(
      internalExitCount ?? 0,
      externalExitCount ?? 0,
      'Exits'
    )
);

export const getOverviewFluctuationExitsCount = createSelector(
  getExternalExitCount,
  getInternalExitCount,
  (externalExitCount: number, internalExitCount: number) =>
    externalExitCount !== undefined && internalExitCount !== undefined
      ? externalExitCount + internalExitCount
      : undefined
);

export const getOverviewFluctuationEntriesCount = createSelector(
  getExternalEntryCount,
  getInternalEntryCount,
  (externalEntryCount: number, internalEntryCount: number) =>
    externalEntryCount !== undefined && internalEntryCount !== undefined
      ? externalEntryCount + internalEntryCount
      : undefined
);

export const getOverviewFluctuationTotalEmployeesCount = createSelector(
  selectOverviewState,
  (overviewState: OverviewState) =>
    overviewState.workforceBalanceMeta.dimension.data?.totalEmployeesCount
);

export const getOverviewFluctuationEntriesDoughnutConfig = createSelector(
  getInternalEntryCount,
  getExternalEntryCount,
  (internalEntryCount: number, externalEntryCount: number) =>
    utils.createDoughnutConfig(
      internalEntryCount ?? 0,
      externalEntryCount ?? 0,
      'Entries'
    )
);

export const getDimensionFluctuationRatesChart = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.fluctuationRatesChart.dimension.data
);

export const getDimensionFluctuationRatesForChart = createSelector(
  getDimensionFluctuationRatesChart,
  getSelectedDimensionValueShort,
  (chartData: FluctuationRatesChartData, dimensionName: string) =>
    createFluctuationRateChartSerie(
      DIMENSION_SERIE_ID,
      dimensionName,
      chartData?.fluctuationRates
    )
);

export const getDimensionUnforcedFluctuationRatesForChart = createSelector(
  getDimensionFluctuationRatesChart,
  getSelectedDimensionValueShort,
  (chartData: FluctuationRatesChartData, dimensionName: string) =>
    createFluctuationRateChartSerie(
      DIMENSION_SERIE_ID,
      dimensionName,
      chartData?.unforcedFluctuationRates
    )
);

export const getBenchmarkFluctuationRatesChart = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.fluctuationRatesChart.benchmark.data
);

export const getBenchmarkFluctuationRatesForChart = createSelector(
  getBenchmarkFluctuationRatesChart,
  getSelectedBenchmarkValueShort,
  (chartData: FluctuationRatesChartData, dimensionName: string) =>
    createFluctuationRateChartSerie(
      BENCHMARK_SERIE_ID,
      dimensionName,
      chartData?.fluctuationRates
    )
);

export const getBenchmarkUnforcedFluctuationRatesForChart = createSelector(
  getBenchmarkFluctuationRatesChart,
  getSelectedBenchmarkValueShort,
  (chartData: FluctuationRatesChartData, dimensionName: string) =>
    createFluctuationRateChartSerie(
      BENCHMARK_SERIE_ID,
      dimensionName,
      chartData?.unforcedFluctuationRates
    )
);

export const getIsLoadingFluctuationRatesForChart = createSelector(
  selectOverviewState,
  (state: OverviewState) =>
    state.fluctuationRatesChart.dimension.loading ||
    state.fluctuationRatesChart.benchmark.loading
);

export const getIsLoadingResignedEmployees = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.resignedEmployees.loading
);

export const getResignedEmployees = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.resignedEmployees.data?.employees
);

export const getResignedEmployeesCount = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.resignedEmployees.data?.resignedEmployeesCount
);

export const getOpenApplications = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.openApplications.data
);

export const getIsLoadingOpenApplications = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.openApplications.loading
);

export const getOpenApplicationsCount = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.openApplicationsCount.data
);

export const getIsLoadingOpenApplicationsCount = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.openApplicationsCount.loading
);
