import { DoughnutChartData } from '../../../shared/charts/models/doughnut-chart-data.model';
import { Color } from '../../../shared/models/color.enum';
import { Reason, ReasonForLeavingRank, ReasonImpact } from '../../models';

export function mapReasonsToTableData(
  reasons: Reason[]
): ReasonForLeavingRank[] {
  if (reasons.length === 0) {
    return [];
  }
  const reasonsArray: ReasonForLeavingRank[] = prepareReaonsForRanking(reasons);

  return rankReasons(reasonsArray);
}

export function rankReasons(reasonsArray: ReasonForLeavingRank[]) {
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

export function filterTopReasons(reasons: Reason[]): Reason[] {
  const interviewReasons = new Map<number, Reason[]>();
  reasons.forEach((reason) => {
    if (interviewReasons.has(reason.interviewId)) {
      interviewReasons.get(reason.interviewId).push(reason);
    } else {
      interviewReasons.set(reason.interviewId, [reason]);
    }
  });

  const topReasons: Reason[] = [];

  interviewReasons.forEach((value) => {
    const importantReasons = value.filter(
      (item) => item.impact === ReasonImpact.HIGH
    );
    if (importantReasons.length > 0) {
      topReasons.push(...importantReasons);
    } else if (value.length === 1) {
      topReasons.push(value[0]);
    }
  });

  return topReasons;
}

export function prepareReaonsForRanking(reasons: Reason[]): {
  reason: string;
  leavers: number;
  rank: number;
  percentage: number;
}[] {
  const reasonCountMap: { [key: number]: number } = {};
  reasons.forEach((item) => {
    if (reasonCountMap[item.reasonId]) {
      reasonCountMap[item.reasonId] += 1;
    } else {
      reasonCountMap[item.reasonId] = 1;
    }
  });

  const reasonsArray: ReasonForLeavingRank[] = Object.keys(reasonCountMap).map(
    (reasonId) => ({
      reasonId: +reasonId,
      reason: reasons.find((item) => item.reasonId === +reasonId).reason,
      leavers: reasonCountMap[+reasonId],
      rank: undefined,
      percentage: getPercentageValue(reasonCountMap[+reasonId], reasons.length),
    })
  );

  reasonsArray.sort((a, b) => b.leavers - a.leavers);

  return reasonsArray;
}

export function mapReasonsToChartData(reasons: Reason[]): DoughnutChartData[] {
  const rankedReasons = prepareReaonsForRanking(reasons);
  const totalReasons = rankedReasons.reduce(
    (acc, item) => acc + item.leavers,
    0
  );

  return rankedReasons.map((item) => ({
    name: item.reason,
    value: item.leavers,
    percent: getPercentageValue(item.leavers, totalReasons),
  }));
}

export function mapReasonsToChildren(
  reasons: Reason[]
): { reason: string; children: DoughnutChartData[] }[] {
  const reasonsMap = new Map<string, Map<string, number>>();

  reasons.forEach((reason) => {
    if (!reasonsMap.has(reason.reason)) {
      reasonsMap.set(reason.reason, new Map<string, number>());
    }

    const reasonMap = reasonsMap.get(reason.reason);
    if (reasonMap.has(reason.detailedReason)) {
      reasonMap.set(
        reason.detailedReason,
        reasonMap.get(reason.detailedReason) + 1
      );
    } else {
      reasonMap.set(reason.detailedReason, 1);
    }
  });

  return [...reasonsMap.entries()].map(([reason, detailedReasons]) => {
    const totalDetailedReasons = [...detailedReasons.values()].reduce(
      (acc, item) => acc + item,
      0
    );

    return {
      reason,
      children: [...detailedReasons.entries()].map(([name, count]) => ({
        name,
        value: count,
        percent: getPercentageValue(count, totalDetailedReasons),
      })),
    };
  });
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
