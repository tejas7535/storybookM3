import { EmployeeWithAction } from '../../../shared/models';
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
  getLeaversByReasonData,
  getReasonsChartData,
  getReasonsChildren,
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
          selectedReason: 'Reason 1',
        },
        comparedReasons: {
          loading: false,
          data: {
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
        leavers: {
          loading: false,
          data: {
            employees: [{ employeeName: 'Max' } as EmployeeWithAction],
            responseModified: false,
          },
          errorMessage: 'Fancy Error',
        },
      },
    },
  };

  const fakeStateTopReasons: {
    reasonsAndCounterMeasures: ReasonsAndCounterMeasuresState;
  } = {
    ...fakeState,
    reasonsAndCounterMeasures: {
      ...fakeState.reasonsAndCounterMeasures,
      reasonsForLeaving: {
        ...fakeState.reasonsAndCounterMeasures.reasonsForLeaving,
        leavers: {
          data: {
            employees: [
              {
                interviewId: 1,
                employeeName: 'Max',
              } as unknown as EmployeeWithAction,
            ],
            responseModified: false,
          },
          errorMessage: undefined,
          loading: false,
        },
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
          percentage: 100,
          rank: 1,
          reason: 'Reason 1',
          reasonId: 2,
        },
        {
          detailedReason: 'Detailed Reason 1',
          detailedReasonId: 12,
          leavers: 1,
          percentage: 100,
          rank: 1.1,
          reason: 'Reason 1',
          reasonId: 2,
        },
      ]);
    });

    test('should return top reasons', () => {
      expect(getReasonsTableData(fakeStateTopReasons)).toEqual([
        {
          leavers: 1,
          percentage: 100,
          rank: 1,
          reason: 'Reason 1',
          reasonId: 2,
        },
        {
          detailedReason: 'Detailed Reason 1',
          detailedReasonId: 12,
          leavers: 1,
          percentage: 100,
          rank: 1.1,
          reason: 'Reason 1',
          reasonId: 2,
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
      expect(getReasonsChartData(fakeStateTopReasons)).toEqual([
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

  describe('getReasonsChildren', () => {
    test('should return reasons children', () => {
      expect(getReasonsChildren(fakeState)).toEqual([
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

  describe('getConductedInterviewsInfo', () => {
    test('should return conducted interviews info', () => {
      expect(getConductedInterviewsInfo(fakeState)).toEqual({
        conducted: 14,
      });
    });
  });

  describe('getComparedReasonsData', () => {
    test('should return compared reasons data', () => {
      const result = getComparedReasonsData(fakeState);

      expect(result).toEqual({
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
          leavers: 1,
          percentage: 100,
          rank: 1,
          reason: 'Reason 2',
          reasonId: 4,
        },
      ]);
    });

    test('should map top reasons', () => {
      const result = getComparedReasonsTableData(fakeStateTopReasons);

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
          value: 1,
        },
      ]);
    });

    test('should map top reasons', () => {
      expect(getComparedReasonsChartData(fakeStateTopReasons)).toEqual([
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
          reason: 'Reason 2',
          children: [
            {
              name: 'Detailed Reason 2',
              value: 1,
              percent: 100,
            },
          ],
        },
        {
          reason: 'Reason 2a',
          children: [
            {
              name: 'Detailed Reason 2a',
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
      });
    });
  });

  describe('getLeaversByReasonLoading', () => {
    test('should return loading', () => {
      expect(getReasonsLoading(fakeState)).toBeFalsy();
    });
  });

  describe('getLeaversByReasonData', () => {
    test('should return leavers by reason data when overall reasons selected', () => {
      expect(getLeaversByReasonData(fakeState)).toEqual({
        employees: [{ employeeName: 'Max' } as EmployeeWithAction],
        responseModified: false,
      });
    });

    test('should return leavers by reason data when top reasons selected', () => {
      expect(getLeaversByReasonData(fakeStateTopReasons)).toEqual({
        employees: [
          { employeeName: 'Max', interviewId: 1 } as EmployeeWithAction,
        ],
        responseModified: false,
      });
    });
  });
});
