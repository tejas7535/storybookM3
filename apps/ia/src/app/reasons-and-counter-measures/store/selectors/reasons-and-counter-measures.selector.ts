import { translate } from '@ngneat/transloco';
import { createSelector } from '@ngrx/store';

import {
  ReasonsAndCounterMeasuresState,
  selectReasonsAndCounterMeasuresState,
} from '..';
import {
  getBeautifiedSelectedTimeRange,
  getSelectedTimePeriod,
} from '../../../core/store/selectors';
import { EmployeesRequest, TimePeriod } from '../../../shared/models';
import { ReasonForLeavingStats } from '../../models/reason-for-leaving-stats.model';
import * as utils from './reasons-and-counter-measures.selector.utils';

export const getComparedSelectedOrgUnit = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.comparedSelectedOrgUnit
);

export const getComparedSelectedTimePeriod = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.comparedSelectedTimePeriod
);

export const getComparedSelectedTimeRange = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.comparedSelectedTimeRange
);

export const getReasonsData = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.reasons.data
);

export const getReasonsTableData = createSelector(
  getReasonsData,
  (data: ReasonForLeavingStats[]) => utils.mapReasonsToTableData(data)
);

export const getReasonsLoading = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.reasons.loading
);

export const getReasonsChartConfig = createSelector(
  getReasonsData,
  getBeautifiedSelectedTimeRange,
  getSelectedTimePeriod,
  (
    stats: ReasonForLeavingStats[],
    timeRange: string,
    timePeriod: TimePeriod
  ) => ({
    title: getTimeRangeTitle(timePeriod, timeRange),
    subTitle:
      stats?.length > 0
        ? translate('reasonsAndCounterMeasures.topFiveReasons.title')
        : translate('reasonsAndCounterMeasures.topFiveReasons.chart.noData'),
  })
);

export const getReasonsChartData = createSelector(
  getReasonsData,
  (reasons: ReasonForLeavingStats[]) =>
    reasons ? utils.getTop5ReasonsForChart(reasons) : []
);

export const getSelectedComparedTimeRange = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.comparedSelectedTimeRange
);

export const getSelectedComparedFilters = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.comparedSelectedOrgUnit
);

export const getCurrentComparedFiltersAndTime = createSelector(
  getSelectedComparedTimeRange,
  getSelectedComparedFilters,
  (timeRange: string, orgUnit: string) =>
    ({ orgUnit, timeRange } as EmployeesRequest)
);

export const getComparedReasonsData = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.comparedReasons.data
);

export const getComparedReasonsTableData = createSelector(
  getComparedReasonsData,
  (data: ReasonForLeavingStats[]) => utils.mapReasonsToTableData(data)
);

export const getComparedReasonsLoading = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.comparedReasons.loading
);

export const getComparedBeautifiedSelectedTimeRange = createSelector(
  getSelectedComparedTimeRange,
  (timeRange: string) => {
    const dates = timeRange?.split('|');

    return timeRange
      ? `${new Date(+dates[0]).toLocaleDateString('en-US')} - ${new Date(
          +dates[1]
        ).toLocaleDateString('en-US')}`
      : undefined;
  }
);

export const getComparedTimePeriod = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.comparedSelectedTimePeriod
);

export const getComparedReasonsChartConfig = createSelector(
  getComparedReasonsData,
  getComparedBeautifiedSelectedTimeRange,
  getComparedTimePeriod,
  (
    stats: ReasonForLeavingStats[],
    timeRange: string,
    timePeriod: TimePeriod
  ) => ({
    title: getTimeRangeTitle(timePeriod, timeRange),
    subTitle:
      stats?.length > 0
        ? translate('reasonsAndCounterMeasures.topFiveReasons.title')
        : translate('reasonsAndCounterMeasures.topFiveReasons.chart.noData'),
  })
);

export const getComparedReasonsChartData = createSelector(
  getComparedReasonsData,
  (reasons: ReasonForLeavingStats[]) =>
    reasons ? utils.getTop5ReasonsForChart(reasons) : undefined
);

export const getPercentageValue = (part: number, total: number) => {
  if (part === 0 || total === 0) {
    return 0;
  }

  return Number.parseFloat(((part / total) * 100).toFixed(1));
};
function getTimeRangeTitle(timePeriod: TimePeriod, timeRange: string): any {
  return timePeriod === TimePeriod.LAST_12_MONTHS
    ? translate(`filters.periodOfTime.${TimePeriod.LAST_12_MONTHS}`)
    : timeRange;
}
