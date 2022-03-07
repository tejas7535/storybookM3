import { translate } from '@ngneat/transloco';
import { createSelector } from '@ngrx/store';

import {
  getBeautifiedSelectedTimeRange,
  getSelectedTimePeriod,
} from '../../../core/store/selectors';
import { ChartLegendItem } from '../../../shared/charts/models/chart-legend-item.model';
import { DoughnutChartData } from '../../../shared/charts/models/doughnut-chart-data.model';
import { EmployeesRequest, TimePeriod } from '../../../shared/models';
import { ReasonForLeavingStats } from '../../models/reason-for-leaving-stats.model';
import {
  ReasonsAndCounterMeasuresState,
  selectReasonsAndCounterMeasuresState,
} from '..';
import * as utils from './reasons-and-counter-measures.selector.utils';
import { getColorsForChart } from './reasons-and-counter-measures.selector.utils';

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

export const getReasonsChartData = createSelector(
  getReasonsData,
  (reasons: ReasonForLeavingStats[]) =>
    reasons ? utils.getTop5ReasonsForChart(reasons) : []
);

export const getReasonsChartConfig = createSelector(
  getReasonsData,
  getBeautifiedSelectedTimeRange,
  getSelectedTimePeriod,
  getReasonsChartData,
  (
    stats: ReasonForLeavingStats[],
    timeRange: string,
    timePeriod: TimePeriod,
    originalData: DoughnutChartData[]
  ) => ({
    title: getTimeRangeTitle(timePeriod, timeRange),
    subTitle:
      stats === undefined || stats.length === 0
        ? translate('reasonsAndCounterMeasures.topFiveReasons.chart.noData')
        : undefined,
    tooltipFormatter: utils.getTooltipFormatter(),
    color: utils.getColorsForChart(originalData),
  })
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

export const getComparedReasonsChartData = createSelector(
  getComparedReasonsData,
  (reasons: ReasonForLeavingStats[]) =>
    reasons ? utils.getTop5ReasonsForChart(reasons) : undefined
);

export const getComparedReasonsChartConfig = createSelector(
  getComparedReasonsData,
  getComparedBeautifiedSelectedTimeRange,
  getComparedTimePeriod,
  getReasonsChartData,
  getComparedReasonsChartData,
  (
    stats: ReasonForLeavingStats[],
    timeRange: string,
    timePeriod: TimePeriod,
    originalData: DoughnutChartData[],
    compareData: DoughnutChartData[]
  ) => ({
    title: getTimeRangeTitle(timePeriod, timeRange),
    subTitle:
      stats === undefined || stats.length === 0
        ? translate('reasonsAndCounterMeasures.topFiveReasons.chart.noData')
        : undefined,
    tooltipFormatter: utils.getTooltipFormatter(),
    color: utils.getColorsForChart(originalData, compareData),
  })
);

export const getReasonsCombinedLegend = createSelector(
  getReasonsChartData,
  getComparedReasonsChartData,
  (data, comparedData) => {
    const colors = getColorsForChart(data);
    const items = utils.mapDataToLegendItems(data, colors);

    if (comparedData) {
      const comparedLegendColors = getColorsForChart(data, comparedData);
      const comparedLegendItems: ChartLegendItem[] = utils.mapDataToLegendItems(
        comparedData,
        comparedLegendColors
      );
      const uniqueComparedItems =
        utils.getUniqueChartLegendItemsFromComparedLegend(
          items,
          comparedLegendItems
        );

      return [...items, ...uniqueComparedItems];
    } else {
      return items;
    }
  }
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
