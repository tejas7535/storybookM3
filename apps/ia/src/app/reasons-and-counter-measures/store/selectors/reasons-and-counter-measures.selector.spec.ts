import { EmployeeWithAction } from '../../../shared/models';
import {
  AnalysisData,
  ReasonForLeavingRank,
  ReasonForLeavingTab,
  ReasonImpact,
} from '../../models';
import { ReasonsAndCounterMeasuresState } from '..';
import {
  getComparedConductedInterviewsInfo,
  getComparedGeneralQuestionsAnalysis,
  getComparedReasonsAnalysis,
  getComparedReasonsAnalysisData,
  getComparedReasonsChartData,
  getComparedReasonsChildren,
  getComparedReasonsData,
  getComparedReasonsTableData,
  getConductedInterviewsInfo,
  getCurrentTab,
  getGeneralQuestionsAnalysis,
  getLeaversByReasonData,
  getReasonsAnalysis,
  getReasonsAnalysisData,
  getReasonsChartData,
  getReasonsChildren,
  getReasonsLoading,
  getReasonsTableData,
  getTopReasonsIds,
} from './reasons-and-counter-measures.selector';

describe('ReasonsAndCounterMeasures Selector', () => {
  const fakeState: {
    reasonsAndCounterMeasures: ReasonsAndCounterMeasuresState;
  } = {
    reasonsAndCounterMeasures: {
      reasonsForLeaving: {
        selectedTab: ReasonForLeavingTab.OVERALL_REASONS,
        reasons: {
          reasonsData: {
            errorMessage: 'Fancy Error',
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
          },
          reasonAnalysis: {
            loading: false,
            data: {
              answer: {
                generalQuestions: {
                  chart: {
                    data: [
                      { value: 20, name: 'Yes' },
                      { value: 0, name: 'No' },
                    ],
                    question: 'Will employees miss Schaeffler?',
                  },
                  reasonAnalysis: [
                    {
                      question: undefined,
                      data: [
                        {
                          reasonId: undefined,
                          show: undefined,
                        },
                      ],
                    },
                  ],
                },
                reasons: [
                  {
                    reasonId: 2,
                    fullWidth: true,
                    quotes: [],
                    impacts: [],
                    show: true,
                  },
                ],
              },
            },
          },
          selectedReason: 'Reason 1',
        },
        comparedReasons: {
          reasonsData: {
            loading: false,
            errorMessage: 'Fancy Error',
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
          },
          reasonAnalysis: {
            loading: true,
            data: {
              answer: {
                generalQuestions: {
                  chart: {
                    data: [
                      { value: 20, name: 'Yes' },
                      { value: 0, name: 'No' },
                    ],
                    question: 'Will employees miss Schaeffler?',
                  },
                  reasonAnalysis: [
                    {
                      question: undefined,
                      data: [
                        {
                          reasonId: undefined,
                          show: undefined,
                        },
                      ],
                    },
                  ],
                },
                reasons: [
                  {
                    reasonId: 4,
                    fullWidth: true,
                    quotes: [],
                    impacts: [],
                    show: true,
                  },
                ],
              },
            },
          },
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
          reasonId: 2,
          fullWidth: true,
          quotes: [],
          impacts: [],
          show: true,
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
          reasonId: 2,
          fullWidth: true,
          quotes: [],
          impacts: [],
          show: true,
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
    test('should map compared top reasons', () => {
      const result = getComparedReasonsTableData(fakeStateTopReasons);

      expect(result).toEqual([
        {
          leavers: 1,
          percentage: 100,
          rank: 1,
          reason: 'Reason 2a',
          reasonId: 4,
        },
        {
          reasonId: 4,
          fullWidth: true,
          quotes: [],
          impacts: [],
          show: true,
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

  describe('getReasonsAnalysis', () => {
    test('should return reasons analysis', () => {
      expect(getReasonsAnalysis(fakeState)).toEqual([
        {
          reasonId: 2,
          fullWidth: true,
          quotes: [],
          impacts: [],
          show: true,
        },
      ]);
    });
  });

  describe('getComparedReasonsAnalysis', () => {
    test('should return compared reasons analysis', () => {
      expect(getComparedReasonsAnalysis(fakeState)).toEqual([
        {
          reasonId: 4,
          fullWidth: true,
          quotes: [],
          impacts: [],
          show: true,
        },
      ]);
    });
  });

  describe('getTopReasonsIds', () => {
    test('should return 2 top reasons ids', () => {
      const reasons: (ReasonForLeavingRank | AnalysisData)[] = [
        { reasonId: 1 } as ReasonForLeavingRank,
        { reasonId: 2 } as ReasonForLeavingRank,
        { reasonId: 3 } as ReasonForLeavingRank,
        { reasonId: 4 } as ReasonForLeavingRank,
      ];

      const result = getTopReasonsIds.projector(reasons);

      expect(result.length).toBe(2);
      expect(result).toEqual([1, 2]);
    });

    test('should return 1 top reasons id when only 1 reason', () => {
      const reasons: (ReasonForLeavingRank | AnalysisData)[] = [
        { reasonId: 1 } as ReasonForLeavingRank,
      ];

      const result = getTopReasonsIds.projector(reasons);

      expect(result.length).toBe(1);
      expect(result).toEqual([1]);
    });

    test('should return empty array when no reasons', () => {
      const result = getTopReasonsIds.projector([]);

      expect(result.length).toBe(0);
    });

    test('should return empty array when reasons undefined', () => {
      const result = getTopReasonsIds.projector(
        undefined as ReasonForLeavingRank[]
      );

      expect(result.length).toBe(0);
    });
  });

  describe('getGeneralQuestionsAnalysis', () => {
    test('should return general questions analysis', () => {
      expect(getGeneralQuestionsAnalysis(fakeState)).toEqual([
        {
          chart: {
            data: [
              { name: 'Yes', value: 20 },
              { name: 'No', value: 0 },
            ],
            question: 'Will employees miss Schaeffler?',
          },
          reasonAnalysis: undefined,
        },
        {
          chart: undefined,
          reasonAnalysis: {
            question: undefined,
            reasons: [{ reasonId: undefined, show: undefined }],
          },
        },
      ]);
    });
  });

  describe('getComparedGeneralQuestionsAnalysis', () => {
    test('should return compared general questions analysis', () => {
      expect(getComparedGeneralQuestionsAnalysis(fakeState)).toEqual([
        {
          chart: {
            data: [
              { name: 'Yes', value: 20 },
              { name: 'No', value: 0 },
            ],
            question: 'Will employees miss Schaeffler?',
          },
          reasonAnalysis: undefined,
        },
        {
          chart: undefined,
          reasonAnalysis: {
            question: undefined,
            reasons: [{ reasonId: undefined, show: undefined }],
          },
        },
      ]);
    });
  });

  describe('getReasonsAnalysisData', () => {
    test('should return reasons analysis data', () => {
      expect(getReasonsAnalysisData(fakeState)).toEqual({
        chart: {
          data: [
            { value: 20, name: 'Yes' },
            { value: 0, name: 'No' },
          ],
          question: 'Will employees miss Schaeffler?',
        },
        reasonAnalysis: [
          {
            question: undefined,
            data: [
              {
                reasonId: undefined,
                show: undefined,
              },
            ],
          },
        ],
      });
    });
  });

  describe('getComparedReasonsAnalysisData', () => {
    test('should return compared reasons analysis data', () => {
      expect(getComparedReasonsAnalysisData(fakeState)).toEqual({
        chart: {
          data: [
            { value: 20, name: 'Yes' },
            { value: 0, name: 'No' },
          ],
          question: 'Will employees miss Schaeffler?',
        },
        reasonAnalysis: [
          {
            question: undefined,
            data: [
              {
                reasonId: undefined,
                show: undefined,
              },
            ],
          },
        ],
      });
    });
  });
});
