import { translate } from '@ngneat/transloco';

import { DoughnutChartData } from '../../../shared/charts/models/doughnut-chart-data.model';
import { ReasonForLeavingRank } from '../../models/reason-for-leaving-rank.model';
import { ReasonForLeavingStats } from '../../models/reason-for-leaving-stats.model';
import { getPercentageValue } from './reasons-and-counter-measures.selector';

export function mapReasonsToTableData(data: ReasonForLeavingStats[]) {
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

export function getTooltipFormatter(): string {
  const leavers = translate(
    'reasonsAndCounterMeasures.topFiveReasons.chart.tooltip.leavers'
  );

  return `{b}<br><b>{c}</b> ${leavers} - <b>{d}%</b>`;
}
