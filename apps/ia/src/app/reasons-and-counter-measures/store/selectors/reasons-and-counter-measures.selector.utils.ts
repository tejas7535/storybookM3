import { translate } from '@jsverse/transloco';

import { DoughnutChartData } from '../../../shared/charts/models/doughnut-chart-data.model';
import { Color } from '../../../shared/models/color.enum';
import { Reason, ReasonForLeavingRank } from '../../models';
import { ReasonForLeavingStats } from '../../models/reason-for-leaving-stats.model';

export function mapReasonsToTableData(
  reasons: Reason[]
): ReasonForLeavingRank[] {
  if (reasons.length === 0) {
    return [];
  }
  const reasonsArray: ReasonForLeavingRank[] = prepareReaonsForRanking(reasons);

  let currentRank = 1;
  let currentLeavers = reasonsArray[0].leavers;
  reasonsArray.forEach((item, index) => {
    if (item.leavers < currentLeavers) {
      currentRank = index + 1;
      currentLeavers = item.leavers;
    }
    item.rank = currentRank;
  });

  return reasonsArray;
}

function prepareReaonsForRanking(reasons: Reason[]) {
  const reasonCountMap: { [key: string]: number } = {};
  reasons.forEach((item) => {
    if (reasonCountMap[item.reason]) {
      reasonCountMap[item.reason] += 1;
    } else {
      reasonCountMap[item.reason] = 1;
    }
  });

  const reasonsArray: ReasonForLeavingRank[] = Object.keys(reasonCountMap).map(
    (reason) => ({
      reason,
      leavers: reasonCountMap[reason],
      rank: undefined,
      percentage: getPercentageValue(reasonCountMap[reason], reasons.length),
    })
  );

  reasonsArray.sort((a, b) => b.leavers - a.leavers);

  return reasonsArray;
}

export function mapReasonsToChartData(reasons: Reason[]) {
  const rankedReasons = prepareReaonsForRanking(reasons);

  return rankedReasons.map((item) => ({
    name: item.reason,
    value: item.leavers,
  }));
}

export function getTop5ReasonsForChart(
  _data: ReasonForLeavingStats
): DoughnutChartData[] {
  return [];
}

export function getTooltipFormatter(): string {
  const leavers = translate(
    'reasonsAndCounterMeasures.topFiveReasons.chart.tooltip.leavers'
  );

  return `{b}<br><b>{c}</b> ${leavers} - <b>{d}%</b>`;
}

export const COLOR_PALETTE = [
  Color.COLORFUL_CHART_1,
  Color.COLORFUL_CHART_2,
  Color.COLORFUL_CHART_3,
  Color.COLORFUL_CHART_4,
  Color.COLORFUL_CHART_5,
  Color.COLORFUL_CHART_6,
  Color.COLORFUL_CHART_7,
  Color.COLORFUL_CHART_8,
  Color.COLORFUL_CHART_9,
  Color.COLORFUL_CHART_10,
  Color.COLORFUL_CHART_11,
  Color.COLORFUL_CHART_12,
  Color.COLORFUL_CHART_13,
  Color.COLORFUL_CHART_14,
  Color.COLORFUL_CHART_15,
  Color.COLORFUL_CHART_16,
  Color.COLORFUL_CHART_17,
  Color.COLORFUL_CHART_18,
  Color.COLORFUL_CHART_19,
  Color.COLORFUL_CHART_20,
];

export const getPercentageValue = (part: number, total: number) => {
  if (part === 0 || total === 0) {
    return 0;
  }

  return Number.parseFloat(((part / total) * 100).toFixed(1));
};
