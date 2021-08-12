import { translate } from '@ngneat/transloco';
import { createSelector } from '@ngrx/store';

import {
  ReasonsAndCounterMeasuresState,
  selectReasonsAndCounterMeasuresState,
} from '..';
import { getBeautifiedSelectedTimeRange } from '../../../core/store/selectors';
import { DoughnutChartData } from '../../../shared/charts/models/doughnut-chart-data.model';
import { ReasonForLeavingRank } from '../../models/reason-for-leaving-rank.model';
import { ReasonForLeavingStats } from '../../models/reason-for-leaving-stats.model';

export const getComparedSelectedOrgUnit = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving?.comparedSelectedOrgUnit.value?.toString()
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
  (data: ReasonForLeavingStats[]) => {
    const totalLeavers = data
      ?.map((reason) => reason.leavers)
      .reduce((valuePrev, valueCurrent) => valuePrev + valueCurrent, 0);

    const rankList = data?.map((d) => d.leavers).sort((a, b) => b - a);

    return data?.map(
      (reason) =>
        new ReasonForLeavingRank(
          rankList.indexOf(reason.leavers) + 1,
          reason.detailedReason,
          getPercentageValue(reason.leavers, totalLeavers),
          reason.leavers
        )
    );
  }
);

export const getReasonsLoading = createSelector(
  selectReasonsAndCounterMeasuresState,
  (state: ReasonsAndCounterMeasuresState) =>
    state.reasonsForLeaving.reasons.loading
);

export const getReasonsChartConfig = createSelector(
  getReasonsData,
  getBeautifiedSelectedTimeRange,
  (stats: ReasonForLeavingStats[], timeRange: string) => ({
    title: timeRange,
    subTitle:
      stats?.length > 0
        ? translate('reasonsAndCounterMeasures.topFiveReasons.title')
        : translate('reasonsAndCounterMeasures.topFiveReasons.chart.noData'),
  })
);

export const getReasonsChartData = createSelector(
  getReasonsData,
  (reasons: ReasonForLeavingStats[]) =>
    reasons ? getTop5ReasonsForChart(reasons) : []
);

export function getTop5ReasonsForChart(
  data: ReasonForLeavingStats[]
): DoughnutChartData[] {
  if (data.length === 0) {
    return [];
  }
  const top5Reasons = data
    .slice(0, 5)
    .map((reason) => ({ value: reason.leavers, name: reason.detailedReason }));

  if (data.length > 5) {
    const otherCount = data
      .slice(5)
      .map((reason) => reason.leavers)
      // eslint-disable-next-line unicorn/no-array-reduce
      .reduce((valuePrev, valueCurrent) => valuePrev + valueCurrent, 0);

    top5Reasons.push({
      value: otherCount,
      name: translate('reasonsAndCounterMeasures.topFiveReasons.chart.others'),
    });
  }

  return top5Reasons;
}

export const getPercentageValue = (part: number, total: number) => {
  if (part === 0 || total === 0) {
    return 0;
  }

  return Number.parseFloat(((part / total) * 100).toFixed(1));
};
