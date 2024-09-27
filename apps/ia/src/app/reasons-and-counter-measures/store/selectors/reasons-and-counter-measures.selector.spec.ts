import { ReasonForLeavingTab, ReasonImpact } from '../../models';
import { ReasonsAndCounterMeasuresState } from '..';
import {
  getComparedConductedInterviewsInfo,
  getComparedReasonsChartData,
  getComparedReasonsChildren,
  getComparedReasonsData,
  getComparedReasonsTableData,
  getConductedInterviewsInfo,
  getCurrentTab,
  getReasonsChartData,
  getReasonsLoading,
  getReasonsTableData,
} from './reasons-and-counter-measures.selector';

describe('ReasonsAndCounterMeasures Selector', () => {
  const fakeState: {
    reasonsAndCounterMeasures: ReasonsAndCounterMeasuresState;
  } = {
    reasonsAndCounterMeasures: {
      reasonsForLeaving: {
        selectedTab: ReasonForLeavingTab.OVERALL_REASONS,
        reasons: {
          loading: false,
          data: {
            totalInterviews: 32,
            conductedInterviews: 14,
            reasons: [
              {
                interviewId: 1,
                reason: 'Reason 1',
                reasonId: 2,
                detailedReason: 'Detailed Reason 1',
                detailedReasonId: 12,
                impact: ReasonImpact.HIGH,
              },
              {
                interviewId: 2,
                reason: 'Reason 1a',
                reasonId: 3,
                detailedReason: 'Detailed Reason 1',
                detailedReasonId: 13,
                impact: ReasonImpact.MEDIUM,
              },
            ],
          },
          errorMessage: 'Fancy Error',
        },
        comparedReasons: {
          loading: false,
          data: {
            totalInterviews: 32,
            conductedInterviews: 14,
            reasons: [
              {
                interviewId: 1,
                reason: 'Reason 2',
                reasonId: 4,
                detailedReason: 'Detailed Reason 2',
                detailedReasonId: 14,
                impact: ReasonImpact.LOW,
              },
              {
                interviewId: 1,
                reason: 'Reason 2a',
                reasonId: 4,
                detailedReason: 'Detailed Reason 2a',
                detailedReasonId: 14,
                impact: ReasonImpact.HIGH,
              },
            ],
          },
          errorMessage: 'Fancy Error',
        },
      },
    },
  };

  const fakStateTopReasons: {
    reasonsAndCounterMeasures: ReasonsAndCounterMeasuresState;
  } = {
    ...fakeState,
    reasonsAndCounterMeasures: {
      ...fakeState.reasonsAndCounterMeasures,
      reasonsForLeaving: {
        ...fakeState.reasonsAndCounterMeasures.reasonsForLeaving,
        selectedTab: ReasonForLeavingTab.TOP_REASONS,
      },
    },
  };

  describe('getCurrentTab', () => {
    test('should return current tab', () => {
      expect(getCurrentTab(fakeState)).toEqual(
        ReasonForLeavingTab.OVERALL_REASONS
      );
    });
  });

  describe('getReasonsTableData', () => {
    test('should return reasons data', () => {
      expect(getReasonsTableData(fakeState)).toEqual([
        {
          leavers: 1,
          percentage: 50,
          rank: 1,
          reason: 'Reason 1',
          reasonId: 2,
        },
        {
          leavers: 1,
          percentage: 50,
          rank: 1,
          reason: 'Reason 1a',
          reasonId: 3,
        },
      ]);
    });

    test('should return top reasons', () => {
      expect(getReasonsTableData(fakStateTopReasons)).toEqual([
        {
          leavers: 1,
          percentage: 50,
          rank: 1,
          reason: 'Reason 1',
          reasonId: 2,
        },
        {
          leavers: 1,
          percentage: 50,
          rank: 1,
          reason: 'Reason 1a',
          reasonId: 3,
        },
      ]);
    });
  });

  describe('getReasonsLoading', () => {
    test('should return loading', () => {
      expect(getReasonsLoading(fakeState)).toBeFalsy();
    });
  });

  describe('getReasonsChartData', () => {
    test('should map reasons', () => {
      expect(getReasonsChartData(fakeState)).toEqual([
        {
          name: 'Reason 1',
          value: 1,
          percent: 50,
        },
        {
          name: 'Reason 1a',
          value: 1,
          percent: 50,
        },
      ]);
    });

    test('should map top reasons', () => {
      expect(getReasonsChartData(fakStateTopReasons)).toEqual([
        {
          name: 'Reason 1',
          value: 1,
          percent: 50,
        },
        {
          name: 'Reason 1a',
          value: 1,
          percent: 50,
        },
      ]);
    });
  });

  describe('getConductedInterviewsInfo', () => {
    test('should return conducted interviews info', () => {
      expect(getConductedInterviewsInfo(fakeState)).toEqual({
        conducted: 14,
        percentage: 43.8,
      });
    });
  });

  describe('getComparedReasonsData', () => {
    test('should return compared reasons data', () => {
      const result = getComparedReasonsData(fakeState);

      expect(result).toEqual({
        totalInterviews: 32,
        conductedInterviews: 14,
        reasons: [
          {
            interviewId: 1,
            reason: 'Reason 2',
            reasonId: 4,
            detailedReason: 'Detailed Reason 2',
            detailedReasonId: 14,
            impact: ReasonImpact.LOW,
          },
          {
            interviewId: 1,
            reason: 'Reason 2a',
            reasonId: 4,
            detailedReason: 'Detailed Reason 2a',
            detailedReasonId: 14,
            impact: ReasonImpact.HIGH,
          },
        ],
      });
    });
  });

  describe('getComparedReasonsTableData', () => {
    test('shuold map reasons', () => {
      expect(getComparedReasonsTableData(fakeState)).toEqual([
        {
          leavers: 2,
          percentage: 100,
          rank: 1,
          reason: 'Reason 2',
          reasonId: 4,
        },
      ]);
    });

    test('should map top reasons', () => {
      const result = getComparedReasonsTableData(fakStateTopReasons);

      expect(result).toEqual([
        {
          leavers: 1,
          percentage: 100,
          rank: 1,
          reason: 'Reason 2a',
          reasonId: 4,
        },
      ]);
    });
  });

  describe('getComparedReasonsLoading', () => {
    test('should return loading', () => {
      expect(getReasonsLoading(fakeState)).toBeFalsy();
    });
  });

  describe('getOverallComparedReasonsChartData', () => {
    test('should map reasons', () => {
      expect(getComparedReasonsChartData(fakeState)).toEqual([
        {
          name: 'Reason 2',
          percent: 100,
          value: 2,
        },
      ]);
    });

    test('should map top reasons', () => {
      expect(getComparedReasonsChartData(fakStateTopReasons)).toEqual([
        {
          name: 'Reason 2a',
          percent: 100,
          value: 1,
        },
      ]);
    });
  });

  describe('getOverallComparedReasonsChildren', () => {
    test('should return overall comapred reasons children', () => {
      expect(getComparedReasonsChildren(fakeState)).toEqual([
        {
          reason: 'Reason 1',
          children: [
            {
              name: 'Detailed Reason 1',
              value: 1,
              percent: 100,
            },
          ],
        },
        {
          reason: 'Reason 1a',
          children: [
            {
              name: 'Detailed Reason 1',
              value: 1,
              percent: 100,
            },
          ],
        },
      ]);
    });
  });

  describe('getComparedConductedInterviewsInfo', () => {
    test('should return conducted interviews info', () => {
      expect(getComparedConductedInterviewsInfo(fakeState)).toEqual({
        conducted: 14,
        percentage: 43.8,
      });
    });
  });
});
