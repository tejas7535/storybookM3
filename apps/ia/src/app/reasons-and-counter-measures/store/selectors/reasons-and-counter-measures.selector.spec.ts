import { ReasonImpact } from '../../models';
import { ReasonsAndCounterMeasuresState } from '..';
import {
  getComparedConductedInterviewsInfo,
  getComparedReasonsData,
  getConductedInterviewsInfo,
  getOverallComparedReasonsChartData,
  getOverallComparedReasonsTableData,
  getOverallReasonsChartData,
  getOverallReasonsTableData,
  getReasonsLoading,
} from './reasons-and-counter-measures.selector';

describe('ReasonsAndCounterMeasures Selector', () => {
  const fakeState: {
    reasonsAndCounterMeasures: ReasonsAndCounterMeasuresState;
  } = {
    reasonsAndCounterMeasures: {
      reasonsForLeaving: {
        reasons: {
          loading: false,
          data: {
            totalInterviews: 32,
            conductedInterviews: 14,
            reasons: [
              {
                reason: 'Reason 1',
                detailedReason: 'Detailed Reason 1',
                impact: ReasonImpact.HIGH,
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
                reason: 'Reason 2',
                detailedReason: 'Detailed Reason 2',
                impact: ReasonImpact.LOW,
              },
            ],
          },
          errorMessage: 'Fancy Error',
        },
      },
    },
  };

  describe('getReasonsData', () => {
    test('should return reasons data', () => {
      expect(getOverallReasonsTableData(fakeState)).toEqual([
        {
          leavers: 1,
          percentage: 100,
          rank: 1,
          reason: 'Reason 1',
        },
      ]);
    });
  });

  describe('getOverallReasonsTableData', () => {
    test('shuold map reasons', () => {
      expect(getOverallReasonsTableData(fakeState)).toEqual([
        {
          leavers: 1,
          percentage: 100,
          rank: 1,
          reason: 'Reason 1',
        },
      ]);
    });
  });

  describe('getReasonsLoading', () => {
    test('should return loading', () => {
      expect(getReasonsLoading(fakeState)).toBeFalsy();
    });
  });

  describe('getOverallReasonsChartData', () => {
    test('should map reasons', () => {
      expect(getOverallReasonsChartData(fakeState)).toEqual([
        {
          name: 'Reason 1',
          value: 1,
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
      expect(getComparedReasonsData(fakeState)).toEqual({
        totalInterviews: 32,
        conductedInterviews: 14,
        reasons: [
          {
            reason: 'Reason 2',
            detailedReason: 'Detailed Reason 2',
            impact: ReasonImpact.LOW,
          },
        ],
      });
    });
  });

  describe('getOverallComparedReasonsTableData', () => {
    test('shuold map reasons', () => {
      expect(getOverallComparedReasonsTableData(fakeState)).toEqual([
        {
          leavers: 1,
          percentage: 100,
          rank: 1,
          reason: 'Reason 2',
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
      expect(getOverallComparedReasonsChartData(fakeState)).toEqual([
        {
          name: 'Reason 2',
          value: 1,
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
