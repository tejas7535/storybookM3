import { createSelector } from '@ngrx/store';

import {
  getSelectedDimensionIdValue,
  getSelectOrgUnitValueShort,
} from '../../../core/store/selectors';
import {
  ActionType,
  AttritionOverTime,
  EmployeeWithAction,
  IdValue,
} from '../../../shared/models';
import { LeavingType } from '../../models';
import { OverviewFluctuationRates } from '../../models/overview-fluctuation-rates.model';
import { OverviewState, selectOverviewState } from '..';
import * as utils from './overview-selector-utils';

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

export const getOverviewFluctuationRates = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.entriesExitsMeta?.data
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

export const getOverviewFluctuationKpi = createSelector(
  getOverviewFluctuationRates,
  getSelectedDimensionIdValue,
  (
    overviewFluctuationRates: OverviewFluctuationRates,
    selectedOrgUnit: IdValue
  ) =>
    overviewFluctuationRates && selectedOrgUnit
      ? utils.createFluctuationKpi(
          overviewFluctuationRates.fluctuationRate.global,
          overviewFluctuationRates.fluctuationRate.dimension,
          selectedOrgUnit.value,
          overviewFluctuationRates.externalExitCount
        )
      : undefined
);

export const getOverviewUnforcedFluctuationKpi = createSelector(
  getOverviewFluctuationRates,
  getSelectedDimensionIdValue,
  (
    overviewFluctuationRates: OverviewFluctuationRates,
    selectedOrgUnit: IdValue
  ) =>
    overviewFluctuationRates && selectedOrgUnit
      ? utils.createFluctuationKpi(
          overviewFluctuationRates.unforcedFluctuationRate.global,
          overviewFluctuationRates.unforcedFluctuationRate.dimension,
          selectedOrgUnit.value,
          overviewFluctuationRates.externalUnforcedExitCount
        )
      : undefined
);

export const getIsLoadingDoughnutsConfig = createSelector(
  selectOverviewState,
  (overviewState: OverviewState) => overviewState.entriesExitsMeta?.loading
);

export const getInternalExitCount = createSelector(
  selectOverviewState,
  (overviewState: OverviewState) =>
    overviewState.entriesExitsMeta?.data?.internalExitCount
);

export const getExternalExitCount = createSelector(
  selectOverviewState,
  (overviewState: OverviewState) =>
    overviewState.entriesExitsMeta?.data?.externalExitCount
);

export const getInternalEntryCount = createSelector(
  selectOverviewState,
  (overviewState: OverviewState) =>
    overviewState.entriesExitsMeta?.data?.internalEntryCount
);

export const getExternalEntryCount = createSelector(
  selectOverviewState,
  (overviewState: OverviewState) =>
    overviewState.entriesExitsMeta?.data?.externalEntryCount
);

export const getOverviewFluctuationExitsDoughnutConfig = createSelector(
  getInternalExitCount,
  getExternalExitCount,
  (internalExitCount: number, externalExitCount: number) =>
    utils.createDoughnutConfig(internalExitCount, externalExitCount, 'Exits')
);

export const getOverviewFluctuationExitsCount = createSelector(
  getExternalExitCount,
  getInternalExitCount,
  (externalExitCount: number, internalExitCount: number) =>
    externalExitCount + internalExitCount
);

export const getOverviewFluctuationEntriesCount = createSelector(
  getExternalEntryCount,
  getInternalEntryCount,
  (externalEntryCount: number, internalEntryCount: number) =>
    externalEntryCount + internalEntryCount
);

export const getOverviewFluctuationTotalEmployeesCount = createSelector(
  selectOverviewState,
  (overviewState: OverviewState) =>
    overviewState.entriesExitsMeta.data?.totalEmployeesCount
);

export const getOverviewFluctuationEntriesDoughnutConfig = createSelector(
  getInternalEntryCount,
  getExternalEntryCount,
  (internalEntryCount: number, externalEntryCount: number) =>
    utils.createDoughnutConfig(
      internalEntryCount,
      externalEntryCount,
      'Entries'
    )
);

export const getFluctuationRatesForChart = createSelector(
  selectOverviewState,
  getSelectOrgUnitValueShort,
  (state: OverviewState, orgUnit: string) =>
    state.fluctuationRates.data
      ? utils.createFluctuationRateChartConfig(
          orgUnit,
          state.fluctuationRates.data.fluctuationRates
        )
      : undefined
);

export const getUnforcedFluctuationRatesForChart = createSelector(
  selectOverviewState,
  getSelectOrgUnitValueShort,
  (state: OverviewState, orgUnit: string) =>
    state.fluctuationRates.data
      ? utils.createFluctuationRateChartConfig(
          orgUnit,
          state.fluctuationRates.data.unforcedFluctuationRates
        )
      : undefined
);

export const getIsLoadingFluctuationRatesForChart = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.fluctuationRates?.loading
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
