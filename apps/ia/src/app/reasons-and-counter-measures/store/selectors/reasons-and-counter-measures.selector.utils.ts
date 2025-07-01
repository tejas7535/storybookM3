import { DoughnutChartData } from '../../../shared/charts/models/doughnut-chart-data.model';
import {
  AnalysisData,
  Reason,
  ReasonForLeavingRank,
  ReasonImpact,
} from '../../models';

export function mapReasonsToTableData(
  reasons: Reason[],
  selectedReason?: string,
  reasonAnalysis?: AnalysisData[]
): (ReasonForLeavingRank | AnalysisData)[] {
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

  const rankedReasons: (ReasonForLeavingRank | AnalysisData)[] = rankReasons(
    reasonsArray,
    !!selectedReason
  );

  if (selectedReason && rankedReasons.length > 0) {
    const mainReason = reasons.find((item) => item.reason === selectedReason);
    rankedReasons.unshift(
      new ReasonForLeavingRank(
        1,
        mainReason?.reasonId,
        mainReason?.reason,
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

  reasonAnalysis?.forEach((analysis) => {
    const reasonIndex = rankedReasons.findIndex(
      (item) => item.reasonId === analysis.reasonId && analysis.show
    );
    if (reasonIndex !== -1) {
      rankedReasons.splice(reasonIndex + 1, 0, analysis);
    }
  });

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
      interviewReasons.get(reason.interviewId)?.push(reason);
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
      reasonCountMap.get(item[type])?.add(item.interviewId);
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
        leavers: reasonCountMap.get(+reasonId)?.size,
        rank: undefined as number,
        percentage: getPercentageValue(
          reasonCountMap.get(+reasonId)
            ? reasonCountMap.get(+reasonId)?.size
            : undefined,
          totalReasons
        ),
      } as ReasonForLeavingRank;
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
    if (reasonMap) {
      const detailedReason = reasonMap.get(reason.detailedReason);
      if (detailedReason) {
        reasonMap.set(reason.detailedReason, detailedReason + 1);
      } else {
        reasonMap.set(reason.detailedReason, 1);
      }
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

export const getPercentageValue = (
  part: number | undefined,
  total: number | undefined
) => {
  if (!part || !total) {
    return 0;
  }

  return Number.parseFloat(((part / total) * 100).toFixed(1));
};
