import { createSelector } from '@ngrx/store';

import { OverviewState, selectOverviewState } from '..';
import {
  getSelectedOrgUnit,
  getSelectedTimeRange,
} from '../../../core/store/selectors';
import { AttritionOverTime } from '../../../shared/models';
import { OverviewFluctuationRates } from '../../../shared/models/overview-fluctuation-rates';
import { DoughnutConfig } from '../../entries-exits/doughnut-chart/models/doughnut-config.model';
import { DoughnutSeriesConfig } from '../../entries-exits/doughnut-chart/models/doughnut-series-config.model';

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
  (state: OverviewState) => state.fluctuationRates?.data
);

export const getOverviewFluctuationEntriesCount = createSelector(
  getOverviewFluctuationRates,
  (overviewFluctuationRates: OverviewFluctuationRates) =>
    overviewFluctuationRates?.entries
);

export const getOverviewFluctuationExitsCount = createSelector(
  getOverviewFluctuationRates,
  (overviewFluctuationRates: OverviewFluctuationRates) =>
    overviewFluctuationRates?.exits
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

export const getOverviewFluctuationEntriesDoughnutConfig = createSelector(
  getOverviewFluctuationRates,
  getSelectedTimeRange,
  (
    overviewFluctuationRates: OverviewFluctuationRates,
    selectedTimeRange: string
  ) => {
    const internal = overviewFluctuationRates?.allEmployees?.filter(
      (employee) =>
        isDateInTimeRange(selectedTimeRange, employee.internalEntryDate)
    );
    const external = overviewFluctuationRates?.allEmployees?.filter(
      (employee) => isDateInTimeRange(selectedTimeRange, employee.entryDate)
    );

    return internal && external
      ? createDoughnutConfig(internal.length, external.length, 'Entries')
      : createDoughnutConfig(0, 0, 'Entries');
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
        employee.orgUnit.indexOf(selectedOrgUnit.toString()) === 0 &&
        isDateInTimeRange(selectedTimeRange, employee.internalExitDate)
    );
    const external = overviewFluctuationRates?.exitEmployees?.filter(
      (employee) =>
        employee.orgUnit.indexOf(selectedOrgUnit.toString()) === 0 &&
        isDateInTimeRange(selectedTimeRange, employee.exitDate)
    );

    return internal && external
      ? createDoughnutConfig(internal.length, external.length, 'Exits')
      : createDoughnutConfig(0, 0, 'Exits');
  }
);

export const getEntryEmployees = createSelector(
  getOverviewFluctuationRates,
  getSelectedTimeRange,
  (
    overviewFluctuationRates: OverviewFluctuationRates,
    selectedTimeRange: string
  ) =>
    overviewFluctuationRates?.allEmployees.filter(
      (employee) =>
        isDateInTimeRange(selectedTimeRange, employee.entryDate) ||
        isDateInTimeRange(selectedTimeRange, employee.internalEntryDate)
    )
);

function isDateInTimeRange(timeRange: string, dateToTest: string): boolean {
  if (!dateToTest || !timeRange) {
    return false;
  }
  const dateToTestP = new Date(dateToTest);
  const timeRangeArr = timeRange.split('|');
  const timeRangeStart = new Date(Number(timeRangeArr[0]));
  const timeRangeEnd = new Date(Number(timeRangeArr[1]));

  return timeRangeStart <= dateToTestP && dateToTestP <= timeRangeEnd;
}

function createDoughnutConfig(
  internalValue: number,
  externalValue: number,
  name: string
) {
  const labelInternal = 'internal';
  const labelExternal = 'external';

  return new DoughnutConfig(
    name,
    [
      new DoughnutSeriesConfig(internalValue, labelInternal),
      new DoughnutSeriesConfig(externalValue, labelExternal),
    ],
    [labelInternal, labelExternal]
  );
}
