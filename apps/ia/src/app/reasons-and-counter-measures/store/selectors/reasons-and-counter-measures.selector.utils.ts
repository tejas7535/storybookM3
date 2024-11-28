import { DoughnutChartData } from '../../../shared/charts/models/doughnut-chart-data.model';
import { Color } from '../../../shared/models/color.enum';
import { Reason, ReasonForLeavingRank, ReasonImpact } from '../../models';

export function mapReasonsToTableData(
  reasons: Reason[],
  selectedReason?: string
): ReasonForLeavingRank[] {
  if (reasons.length === 0) {
    return [];
  }
  const filteredReasons = selectedReason
    ? reasons.filter((item) => item.reason === selectedReason)
    : reasons;

  const reasonsArray: ReasonForLeavingRank[] = prepareReasonsForRanking(
    filteredReasons,
    selectedReason ? 'detailedReasonId' : 'reasonId'
  );

  const rankedReasons = rankReasons(reasonsArray, !!selectedReason);

  if (selectedReason && rankedReasons.length > 0) {
    const mainReason = reasons.find((item) => item.reason === selectedReason);
    rankedReasons.unshift(
      new ReasonForLeavingRank(
        1,
        mainReason.reasonId,
        mainReason.reason,
        undefined,
        undefined,
        new Set(
          reasons
            .filter((item) => item.reason === selectedReason)
            .map((reason) => reason.interviewId)
        ).size,
        100
      )
    );
  }

  return rankedReasons;
}

export function rankReasons(
  reasonsArray: ReasonForLeavingRank[],
  selectedReason = false
): ReasonForLeavingRank[] {
  if (reasonsArray.length === 0) {
    return [];
  }
  let currentRank = 1;
  let currentLeavers = reasonsArray[0].leavers;
  reasonsArray.forEach((item, index) => {
    if (item.leavers < currentLeavers) {
      currentRank = index + 1;
      currentLeavers = item.leavers;
    }
    item.rank = selectedReason ? 1 + currentRank / 10 : currentRank;
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

export function prepareReasonsForRanking(
  reasons: Reason[],
  type: 'reasonId' | 'detailedReasonId' = 'reasonId'
): ReasonForLeavingRank[] {
  // key - reasonId, value - set of interview ids
  const reasonCountMap: Map<number, Set<number>> = new Map();
  reasons.forEach((item) => {
    if (reasonCountMap.get(item[type])) {
      reasonCountMap.get(item[type]).add(item.interviewId);
    } else {
      reasonCountMap.set(item[type], new Set([item.interviewId]));
    }
  });

  const totalReasons = [...reasonCountMap.values()].reduce(
    (acc, item) => acc + item.size,
    0
  );

  const reasonsArray: ReasonForLeavingRank[] = [...reasonCountMap.keys()].map(
    (reasonId) => {
      const reason = reasons.find((item) => item[type] === +reasonId);

      return {
        reasonId: reason?.reasonId,
        reason: reason?.reason,
        detailedReasonId:
          type === 'detailedReasonId' ? reason?.detailedReasonId : undefined,
        detailedReason:
          type === 'detailedReasonId' ? reason?.detailedReason : undefined,
        leavers: reasonCountMap.get(+reasonId).size,
        rank: undefined,
        percentage: getPercentageValue(
          reasonCountMap.get(+reasonId).size,
          totalReasons
        ),
      };
    }
  );

  reasonsArray.sort((a, b) => b.leavers - a.leavers);

  return reasonsArray;
}

export function mapReasonsToChartData(reasons: Reason[]): DoughnutChartData[] {
  const rankedReasons = prepareReasonsForRanking(reasons);
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
