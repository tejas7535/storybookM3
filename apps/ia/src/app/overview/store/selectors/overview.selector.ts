import { createSelector } from '@ngrx/store';

import {
  getSelectedBusinessArea,
  getSelectedTimeRange,
  getSelectOrgUnitValueShort,
} from '../../../core/store/selectors';
import { ActionType, AttritionOverTime, IdValue } from '../../../shared/models';
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

export const getOverviewFluctuationRates = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.entriesExits?.data
);

export const getExitEmployees = createSelector(
  getOverviewFluctuationRates,
  getSelectedTimeRange,
  (
    overviewFluctuationRates: OverviewFluctuationRates,
    selectedTimeRange: IdValue
  ) =>
    overviewFluctuationRates?.exitEmployees.filter(
      (employee) =>
        utils.isDateInTimeRange(selectedTimeRange.id, employee.exitDate) ||
        utils.isDateInTimeRange(
          selectedTimeRange.id,
          employee.actions?.find(
            (e) => e.actionType === ActionType.INTERNAL && e.exitDate
          )?.exitDate
        )
    )
);

export const getOverviewFluctuationKpi = createSelector(
  getOverviewFluctuationRates,
  getSelectedBusinessArea,
  (
    overviewFluctuationRates: OverviewFluctuationRates,
    selectedOrgUnit: IdValue
  ) =>
    overviewFluctuationRates && selectedOrgUnit
      ? utils.createFluctuationKpi(
          overviewFluctuationRates.fluctuationRate.global,
          overviewFluctuationRates.fluctuationRate.dimension,
          selectedOrgUnit.value,
          utils.getExternalLeavers(overviewFluctuationRates.exitEmployees),
          overviewFluctuationRates.externalExitCount
        )
      : undefined
);

export const getOverviewUnforcedFluctuationKpi = createSelector(
  getOverviewFluctuationRates,
  getSelectedBusinessArea,
  (
    overviewFluctuationRates: OverviewFluctuationRates,
    selectedOrgUnit: IdValue
  ) =>
    overviewFluctuationRates && selectedOrgUnit
      ? utils.createFluctuationKpi(
          overviewFluctuationRates.unforcedFluctuationRate.global,
          overviewFluctuationRates.unforcedFluctuationRate.dimension,
          selectedOrgUnit.value,
          utils.getUnforcedLeavers(overviewFluctuationRates.exitEmployees),
          overviewFluctuationRates.externalUnforcedExitCount
        )
      : undefined
);

export const getIsLoadingDoughnutsConfig = createSelector(
  selectOverviewState,
  (overviewState: OverviewState) => overviewState.entriesExits?.loading
);

export const getInternalExitCount = createSelector(
  selectOverviewState,
  (overviewState: OverviewState) =>
    overviewState.entriesExits?.data?.internalExitCount
);

export const getExternalExitCount = createSelector(
  selectOverviewState,
  (overviewState: OverviewState) =>
    overviewState.entriesExits?.data?.externalExitCount
);

export const getInternalEntryCount = createSelector(
  selectOverviewState,
  (overviewState: OverviewState) =>
    overviewState.entriesExits?.data?.internalEntryCount
);

export const getExternalEntryCount = createSelector(
  selectOverviewState,
  (overviewState: OverviewState) =>
    overviewState.entriesExits?.data?.externalEntryCount
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
    overviewState.entriesExits.data?.totalEmployeesCount
);

export const getEntryEmployees = createSelector(
  getOverviewFluctuationRates,
  getSelectedTimeRange,
  (
    overviewFluctuationRates: OverviewFluctuationRates,
    selectedTimeRange: IdValue
  ) =>
    overviewFluctuationRates?.entryEmployees.filter(
      (employee) =>
        utils.isDateInTimeRange(selectedTimeRange.id, employee.entryDate) ||
        utils.isDateInTimeRange(
          selectedTimeRange.id,
          employee.actions?.find(
            (e) => e.actionType === ActionType.INTERNAL && e.entryDate
          )?.entryDate
        )
    )
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
