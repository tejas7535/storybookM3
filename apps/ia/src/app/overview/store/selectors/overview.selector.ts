import { createSelector } from '@ngrx/store';

import {
  getSelectedOrgUnit,
  getSelectedTimeRange,
  getSelectOrgUnitValueShort,
} from '../../../core/store/selectors';
import {
  ActionType,
  AttritionOverTime,
  Employee,
  IdValue,
} from '../../../shared/models';
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

export const getAttritionOverTimeEvents = createSelector(
  getAttritionOverTime,
  (attritionOverTime: AttritionOverTime) => attritionOverTime?.events
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
  getSelectedOrgUnit,
  (
    overviewFluctuationRates: OverviewFluctuationRates,
    selectedOrgUnit: IdValue
  ) =>
    overviewFluctuationRates && selectedOrgUnit
      ? utils.createFluctuationKpi(
          overviewFluctuationRates.fluctuationRate.global,
          overviewFluctuationRates.fluctuationRate.orgUnit,
          selectedOrgUnit.value,
          utils.getExternalLeavers(overviewFluctuationRates.exitEmployees)
        )
      : undefined
);

export const getOverviewUnforcedFluctuationKpi = createSelector(
  getOverviewFluctuationRates,
  getSelectedOrgUnit,
  (
    overviewFluctuationRates: OverviewFluctuationRates,
    selectedOrgUnit: IdValue
  ) =>
    overviewFluctuationRates && selectedOrgUnit
      ? utils.createFluctuationKpi(
          overviewFluctuationRates.unforcedFluctuationRate.global,
          overviewFluctuationRates.unforcedFluctuationRate.orgUnit,
          selectedOrgUnit.value,
          utils.getUnforcedLeavers(overviewFluctuationRates.exitEmployees)
        )
      : undefined
);

export const getIsLoadingDoughnutsConfig = createSelector(
  selectOverviewState,
  (overviewState: OverviewState) => overviewState.entriesExits?.loading
);

export const getOverviewFluctuationExitsDoughnutConfig = createSelector(
  getExitEmployees,
  getSelectedTimeRange,
  getSelectedOrgUnit,
  (employees: Employee[], selectedTimeRange: IdValue) => {
    const internal = employees?.filter((employee) =>
      employee.actions?.some(
        (action) =>
          action.actionType === ActionType.INTERNAL &&
          utils.isDateInTimeRange(selectedTimeRange.id, action.exitDate)
      )
    );
    const external = employees?.filter((employee) =>
      utils.isDateInTimeRange(selectedTimeRange.id, employee.exitDate)
    );

    return utils.createDoughnutConfig(internal, external, 'Exits');
  }
);

export const getOverviewFluctuationExitsCount = createSelector(
  getExitEmployees,
  (employees: Employee[]) => employees?.length
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

export const getOverviewFluctuationEntriesCount = createSelector(
  getEntryEmployees,
  (employees: Employee[]) => employees?.length
);

export const getOverviewFluctuationEntriesDoughnutConfig = createSelector(
  getEntryEmployees,
  getSelectedTimeRange,
  (employees: Employee[], selectedTimeRange: IdValue) => {
    const internal = employees?.filter((employee) =>
      employee.actions?.some(
        (action) =>
          action.actionType === ActionType.INTERNAL &&
          utils.isDateInTimeRange(selectedTimeRange.id, action.entryDate)
      )
    );
    const external = employees?.filter((employee) =>
      utils.isDateInTimeRange(selectedTimeRange.id, employee.entryDate)
    );

    return utils.createDoughnutConfig(internal, external, 'Entries');
  }
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
  (state: OverviewState) => state.resignedEmployees.data
);

export const getOpenApplications = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.openApplications.data
);

export const getIsLoadingOpenApplications = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.openApplications.loading
);
