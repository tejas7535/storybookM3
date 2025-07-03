import { AnalysisData } from '../../models';
import { showReasonAnalysis, updateReasonAnalysisDataOnSuccess } from '.';

describe('ReasonAndCounterMeasuresUtils', () => {
  describe('showReasonAnalysis', () => {
    test('should set analysis show to true if exists', () => {
      const allAnalysis = [
        { reasonId: 12, show: false },
        { reasonId: 13, show: false },
      ] as unknown as AnalysisData[];

      const result = showReasonAnalysis([13, 12], allAnalysis);

      expect(result.length).toBe(2);
      expect(result[0].show).toBeTruthy();
      expect(result[1].show).toBeTruthy();
    });
  });

  describe('updateReasonAnalysisDataOnSuccess', () => {
    test('should update reason analysis', () => {
      const allAnalysis: AnalysisData[] = [
        { reasonId: 12, show: false, loading: true },
        { reasonId: 13, show: false, loading: true },
      ] as AnalysisData[];

      const data: AnalysisData[] = [
        {
          reasonId: 13,
          fullWidth: true,
          loading: true,
          show: true,
          quotes: [],
          impacts: [],
        },
        {
          reasonId: 12,
          fullWidth: true,
          loading: true,
          show: true,
          quotes: [],
          impacts: [],
        },
      ];

      const result = updateReasonAnalysisDataOnSuccess(data, allAnalysis);

      expect(result.length).toBe(2);
      expect(result[0]).toEqual({
        ...data[0],
        fullWidth: true,
        loading: false,
        show: true,
      });
      expect(result[1]).toEqual({
        ...data[1],
        fullWidth: true,
        loading: false,
        show: true,
      });
    });

    test('should return all analysis with fullWidth true if no data', () => {
      const allAnalysis: AnalysisData[] = [
        { reasonId: 12, show: false, loading: true },
        { reasonId: 13, show: false, loading: true },
      ] as AnalysisData[];

      const result = updateReasonAnalysisDataOnSuccess(undefined, allAnalysis);

      expect(result.length).toBe(2);
      expect(result[0]).toEqual({
        reasonId: 12,
        show: false,
        loading: false,
        fullWidth: false,
      });
      expect(result[1]).toEqual({
        reasonId: 13,
        show: false,
        loading: false,
        fullWidth: false,
      });
    });
  });
});
