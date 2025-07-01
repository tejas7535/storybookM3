import { DoughnutChartData } from '../../../shared/charts/models';
import {
  AnalysisData,
  Reason,
  ReasonForLeavingRank,
  ReasonImpact,
} from '../../models';
import * as utils from './reasons-and-counter-measures.selector.utils';

describe('mapReasonsToTableData', () => {
  test('should map reasons to data', () => {
    const reasonA = 'Reason A';
    const reasonB = 'Reason B';
    const reasonC = 'Reason C';
    const reasonD = 'Reason D';
    const reasonE = 'Reason E';
    const reasonF = 'Reason F';
    const data: Reason[] = [
      {
        impact: ReasonImpact.HIGH,
        reason: reasonA,
        detailedReason: 'Detailed Reason A1',
        interviewId: 1,
        reasonId: 1,
        detailedReasonId: 1,
      },
      {
        impact: ReasonImpact.HIGH,
        reason: reasonA,
        detailedReason: 'Detailed Reason A2',
        interviewId: 1,
        reasonId: 1,
        detailedReasonId: 2,
      },
      {
        impact: ReasonImpact.LOW,
        reason: reasonB,
        detailedReason: 'Detailed Reason B1',
        interviewId: 3,
        reasonId: 2,
        detailedReasonId: 3,
      },
      {
        impact: ReasonImpact.MEDIUM,
        reason: reasonB,
        detailedReason: 'Detailed Reason B2',
        interviewId: 4,
        reasonId: 2,
        detailedReasonId: 4,
      },
      {
        impact: ReasonImpact.MEDIUM,
        reason: reasonA,
        detailedReason: 'Detailed Reason A3',
        interviewId: 5,
        reasonId: 1,
        detailedReasonId: 5,
      },
      {
        impact: ReasonImpact.HIGH,
        reason: reasonC,
        detailedReason: 'Detailed Reason C1',
        interviewId: 6,
        reasonId: 3,
        detailedReasonId: 6,
      },
      {
        impact: ReasonImpact.HIGH,
        reason: reasonC,
        detailedReason: 'Detailed Reason C2',
        interviewId: 7,
        reasonId: 3,
        detailedReasonId: 7,
      },
      {
        impact: ReasonImpact.LOW,
        reason: reasonD,
        detailedReason: 'Detailed Reason D1',
        interviewId: 8,
        reasonId: 4,
        detailedReasonId: 8,
      },
      {
        impact: ReasonImpact.MEDIUM,
        reason: reasonE,
        detailedReason: 'Detailed Reason E1',
        interviewId: 9,
        reasonId: 5,
        detailedReasonId: 9,
      },
      {
        impact: ReasonImpact.MEDIUM,
        reason: reasonE,
        detailedReason: 'Detailed Reason E1',
        interviewId: 10,
        reasonId: 5,
        detailedReasonId: 10,
      },
      {
        impact: ReasonImpact.HIGH,
        reason: reasonF,
        detailedReason: 'Detailed Reason F1',
        interviewId: 11,
        reasonId: 6,
        detailedReasonId: 11,
      },
      {
        impact: ReasonImpact.HIGH,
        reason: reasonF,
        detailedReason: 'Detailed Reason F2',
        interviewId: 12,
        reasonId: 6,
        detailedReasonId: 12,
      },
    ];
    const reasonAnalysis: AnalysisData[] = [
      {
        reasonId: 1,
        fullWidth: true,
        loading: false,
        show: true,
        impacts: [],
        quotes: [],
      },
      {
        reasonId: 3,
        fullWidth: true,
        loading: false,
        show: true,
        impacts: [],
        quotes: [],
      },
    ];

    const result = utils.mapReasonsToTableData(data, undefined, reasonAnalysis);

    expect(result).toEqual([
      { reason: reasonA, leavers: 2, rank: 1, percentage: 18.2, reasonId: 1 },
      {
        reasonId: 1,
        fullWidth: true,
        loading: false,
        show: true,
        impacts: [],
        quotes: [],
      },
      { reason: reasonB, leavers: 2, rank: 1, percentage: 18.2, reasonId: 2 },
      { reason: reasonC, leavers: 2, rank: 1, percentage: 18.2, reasonId: 3 },
      {
        reasonId: 3,
        fullWidth: true,
        loading: false,
        show: true,
        impacts: [],
        quotes: [],
      },
      { reason: reasonE, leavers: 2, rank: 1, percentage: 18.2, reasonId: 5 },
      { reason: reasonF, leavers: 2, rank: 1, percentage: 18.2, reasonId: 6 },
      { reason: reasonD, leavers: 1, rank: 6, percentage: 9.1, reasonId: 4 },
    ]);
  });

  describe('prepareReaonsForRanking', () => {
    test('should preapre reasons for ranking', () => {
      const reasons: Reason[] = [
        {
          reason: 'Reason A',
          detailedReason: 'Detailed Reason A',
          impact: ReasonImpact.HIGH,
          interviewId: 1,
          reasonId: 1,
          detailedReasonId: 1,
        },
        {
          reason: 'Reason A',
          detailedReason: 'Detailed Reason B',
          impact: ReasonImpact.HIGH,
          interviewId: 2,
          reasonId: 1,
          detailedReasonId: 2,
        },
        {
          reason: 'Reason B',
          detailedReason: 'Detailed Reason A',
          impact: ReasonImpact.LOW,
          interviewId: 3,
          reasonId: 2,
          detailedReasonId: 3,
        },
        {
          reason: 'Reason B',
          detailedReason: 'Detailed Reason B',
          impact: ReasonImpact.MEDIUM,
          interviewId: 4,
          reasonId: 2,
          detailedReasonId: 4,
        },
      ];

      const result = utils.prepareReasonsForRanking(reasons);

      expect(result).toEqual([
        {
          reason: 'Reason A',
          leavers: 2,
          percentage: 50,
          reasonId: 1,
        },
        {
          reason: 'Reason B',
          leavers: 2,
          percentage: 50,
          reasonId: 2,
        },
      ]);
    });
  });

  describe('mapReasonsToChartData', () => {
    test('should map reasons to chart data', () => {
      const reasons: Reason[] = [
        {
          reason: 'Reason A',
          detailedReason: 'Detailed Reason A',
          impact: ReasonImpact.HIGH,
          interviewId: 1,
          reasonId: 1,
          detailedReasonId: 1,
        },
        {
          reason: 'Reason A',
          detailedReason: 'Detailed Reason B',
          impact: ReasonImpact.HIGH,
          interviewId: 2,
          reasonId: 1,
          detailedReasonId: 2,
        },
        {
          reason: 'Reason B',
          detailedReason: 'Detailed Reason B',
          impact: ReasonImpact.LOW,
          interviewId: 3,
          reasonId: 2,
          detailedReasonId: 3,
        },
        {
          reason: 'Reason C',
          detailedReason: 'Detailed Reason B',
          impact: ReasonImpact.MEDIUM,
          interviewId: 4,
          reasonId: 3,
          detailedReasonId: 4,
        },
      ];

      const result: DoughnutChartData[] = utils.mapReasonsToChartData(reasons);

      expect(result).toEqual([
        {
          value: 2,
          name: 'Reason A',
          percent: 50,
        },
        {
          value: 1,
          name: 'Reason B',
          percent: 25,
        },
        {
          value: 1,
          name: 'Reason C',
          percent: 25,
        },
      ]);
    });
  });

  describe('mapReasonsToChildren', () => {
    test('should map reasons to children', () => {
      const reasons: Reason[] = [
        {
          reason: 'Reason A',
          detailedReason: 'Detailed Reason A',
          impact: ReasonImpact.HIGH,
          interviewId: 1,
          reasonId: 1,
          detailedReasonId: 1,
        },
        {
          reason: 'Reason A',
          detailedReason: 'Detailed Reason B',
          impact: ReasonImpact.HIGH,
          interviewId: 2,
          reasonId: 1,
          detailedReasonId: 2,
        },
        {
          reason: 'Reason B',
          detailedReason: 'Detailed Reason B',
          impact: ReasonImpact.LOW,
          interviewId: 3,
          reasonId: 2,
          detailedReasonId: 3,
        },
        {
          reason: 'Reason C',
          detailedReason: 'Detailed Reason B',
          impact: ReasonImpact.MEDIUM,
          interviewId: 4,
          reasonId: 3,
          detailedReasonId: 4,
        },
      ];

      const result = utils.mapReasonsToChildren(reasons);

      expect(result).toEqual([
        {
          reason: 'Reason A',
          children: [
            {
              name: 'Detailed Reason A',
              value: 1,
              percent: 50,
            },
            {
              name: 'Detailed Reason B',
              value: 1,
              percent: 50,
            },
          ],
        },
        {
          reason: 'Reason B',
          children: [
            {
              name: 'Detailed Reason B',
              value: 1,
              percent: 100,
            },
          ],
        },
        {
          reason: 'Reason C',
          children: [
            {
              name: 'Detailed Reason B',
              value: 1,
              percent: 100,
            },
          ],
        },
      ]);
    });
  });

  describe('getPercentageValue', () => {
    test('should get percentage value', () => {
      const part = 2;
      const total = 11;

      const result = utils.getPercentageValue(part, total);

      expect(result).toEqual(18.2);
    });

    test('should not add decimal numbers for integer', () => {
      const part = 1;
      const total = 1;

      const result = utils.getPercentageValue(part, total);

      expect(result).toEqual(100);
    });

    test('should return 0 when total 0', () => {
      const part = 1;
      const total = 0;

      const result = utils.getPercentageValue(part, total);

      expect(result).toEqual(0);
    });

    test('should return 0 when part 0', () => {
      const part = 0;
      const total = 1;

      const result = utils.getPercentageValue(part, total);

      expect(result).toEqual(0);
    });
  });

  describe('rankReasons', () => {
    test('should rank reasons', () => {
      const reasons: ReasonForLeavingRank[] = [
        {
          reason: 'Reason A',
          leavers: 2,
          percentage: 50,
          reasonId: 1,
          rank: undefined,
          detailedReasonId: 1,
          detailedReason: 'Detailed Reason A',
        },
        {
          reason: 'Reason B',
          leavers: 1,
          percentage: 25,
          reasonId: 2,
          rank: undefined,
          detailedReasonId: 2,
          detailedReason: 'Detailed Reason B',
        },
        {
          reason: 'Reason C',
          leavers: 1,
          percentage: 25,
          reasonId: 3,
          rank: undefined,
          detailedReasonId: 3,
          detailedReason: 'Detailed Reason C',
        },
      ];

      const result = utils.rankReasons(reasons);

      expect(result).toEqual([
        {
          reason: 'Reason A',
          leavers: 2,
          percentage: 50,
          reasonId: 1,
          rank: 1,
          detailedReasonId: 1,
          detailedReason: 'Detailed Reason A',
        },
        {
          reason: 'Reason B',
          leavers: 1,
          percentage: 25,
          reasonId: 2,
          rank: 2,
          detailedReasonId: 2,
          detailedReason: 'Detailed Reason B',
        },
        {
          reason: 'Reason C',
          leavers: 1,
          percentage: 25,
          reasonId: 3,
          rank: 2,
          detailedReasonId: 3,
          detailedReason: 'Detailed Reason C',
        },
      ]);
    });

    test('should return empty array', () => {
      const reasons: ReasonForLeavingRank[] = [];

      const result = utils.rankReasons(reasons);

      expect(result).toEqual([]);
    });
  });
});
