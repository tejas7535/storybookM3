import { createSelector } from '@ngrx/store';

import { OverviewState, selectOverviewState } from '..';
import {
  getSelectedOrgUnit,
  getSelectedTimeRange,
} from '../../../core/store/selectors';
import { DoughnutConfig } from '../../../shared/charts/models/doughnut-config.model';
import { AttritionOverTime } from '../../../shared/models';
import { OverviewFluctuationRates } from '../../models/overview-fluctuation-rates.model';
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

export const getLeaversDataForSelectedOrgUnit = createSelector(
  getOverviewFluctuationRates,
  getSelectedOrgUnit,
  (
    overviewFluctuationRates: OverviewFluctuationRates,
    selectedOrgUnit: string
  ) =>
    overviewFluctuationRates?.exitEmployees.filter(
      (employee) => employee.orgUnit?.indexOf(selectedOrgUnit.toString()) === 0
    )
);

export const getOverviewFluctuationKpi = createSelector(
  getOverviewFluctuationRates,
  getSelectedOrgUnit,
  (
    overviewFluctuationRates: OverviewFluctuationRates,
    selectedOrgUnit: string
  ) =>
    overviewFluctuationRates && selectedOrgUnit
      ? utils.createFluctuationKpi(
          overviewFluctuationRates.fluctuationRate.company,
          overviewFluctuationRates.fluctuationRate.orgUnit,
          selectedOrgUnit,
          utils.getExternalLeaversByOrgUnit(
            overviewFluctuationRates.exitEmployees,
            selectedOrgUnit
          )
        )
      : undefined
);

export const getOverviewUnforcedFluctuationKpi = createSelector(
  getOverviewFluctuationRates,
  getSelectedOrgUnit,
  (
    overviewFluctuationRates: OverviewFluctuationRates,
    selectedOrgUnit: string
  ) =>
    overviewFluctuationRates && selectedOrgUnit
      ? utils.createFluctuationKpi(
          overviewFluctuationRates.unforcedFluctuationRate.company,
          overviewFluctuationRates.unforcedFluctuationRate.orgUnit,
          selectedOrgUnit,
          utils.getUnforcedLeaversByOrgUnit(
            overviewFluctuationRates.exitEmployees,
            selectedOrgUnit
          )
        )
      : undefined
);

export const getIsLoadingDoughnutsConfig = createSelector(
  selectOverviewState,
  (overviewState: OverviewState) => overviewState.entriesExits?.loading
);

export const getOverviewFluctuationEntriesDoughnutConfig = createSelector(
  getOverviewFluctuationRates,
  getSelectedTimeRange,
  (
    overviewFluctuationRates: OverviewFluctuationRates,
    selectedTimeRange: string
  ) => {
    const internal = overviewFluctuationRates?.entryEmployees?.filter(
      (employee) =>
        utils.isDateInTimeRange(selectedTimeRange, employee.internalEntryDate)
    );
    const external = overviewFluctuationRates?.entryEmployees?.filter(
      (employee) =>
        utils.isDateInTimeRange(selectedTimeRange, employee.entryDate)
    );

    return utils.createDoughnutConfig(internal, external, 'Entries');
  }
);

export const getOverviewFluctuationExitsDoughnutConfig = createSelector(
  getOverviewFluctuationRates,
  getSelectedTimeRange,
  getSelectedOrgUnit,
  (
    overviewFluctuationRates: OverviewFluctuationRates,
    selectedTimeRange: string,
    selectedOrgUnit: string
  ) => {
    const internal = overviewFluctuationRates?.exitEmployees?.filter(
      (employee) =>
        employee.orgUnit.indexOf(selectedOrgUnit) === 0 &&
        utils.isDateInTimeRange(selectedTimeRange, employee.internalExitDate)
    );
    const external = overviewFluctuationRates?.exitEmployees?.filter(
      (employee) =>
        employee.orgUnit.indexOf(selectedOrgUnit) === 0 &&
        utils.isDateInTimeRange(selectedTimeRange, employee.exitDate)
    );

    return utils.createDoughnutConfig(internal, external, 'Exits');
  }
);

export const getOverviewFluctuationEntriesCount = createSelector(
  getOverviewFluctuationEntriesDoughnutConfig,
  (doughnutConfig: DoughnutConfig) =>
    doughnutConfig?.series
      .map((config) => config.data[0].value)
      // eslint-disable-next-line unicorn/no-array-reduce
      .reduce((valuePrev, valueCurrent) => valuePrev + valueCurrent)
);

export const getOverviewFluctuationExitsCount = createSelector(
  getOverviewFluctuationExitsDoughnutConfig,
  (doughnutConfig: DoughnutConfig) =>
    doughnutConfig?.series
      .map((config) => config.data[0].value)
      // eslint-disable-next-line unicorn/no-array-reduce
      .reduce((valuePrev, valueCurrent) => valuePrev + valueCurrent)
);

export const getEntryEmployees = createSelector(
  getOverviewFluctuationRates,
  getSelectedTimeRange,
  (
    overviewFluctuationRates: OverviewFluctuationRates,
    selectedTimeRange: string
  ) =>
    overviewFluctuationRates?.entryEmployees.filter(
      (employee) =>
        utils.isDateInTimeRange(selectedTimeRange, employee.entryDate) ||
        utils.isDateInTimeRange(selectedTimeRange, employee.internalEntryDate)
    )
);

export const getFluctuationRatesForChart = createSelector(
  selectOverviewState,
  (state: OverviewState) =>
    state.fluctuationRates.data
      ? utils.createFluctuationRateChartConfig(state.fluctuationRates.data)
      : undefined
);

export const getUnforcedFluctuationRatesForChart = createSelector(
  selectOverviewState,
  (state: OverviewState) =>
    state.unforcedFluctuationRates.data
      ? utils.createFluctuationRateChartConfig(
          state.unforcedFluctuationRates.data
        )
      : undefined
);

export const getIsLoadingFluctuationRatesForChart = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.fluctuationRates?.loading
);

export const getIsLoadingUnforcedFluctuationRatesForChart = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.unforcedFluctuationRates?.loading
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
