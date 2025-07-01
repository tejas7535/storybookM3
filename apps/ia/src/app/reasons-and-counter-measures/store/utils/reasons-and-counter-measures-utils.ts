import { AnalysisData } from '../../models';

export const updateReasonAnalysisDataOnSuccess = (
  data: AnalysisData[],
  allAnalysis: AnalysisData[]
): AnalysisData[] => {
  if (!allAnalysis) {
    return data.map((analysis: AnalysisData) => ({
      ...analysis,
      loading: false,
      show: false,
      fullWidth: true,
    }));
  }
  const analysisToUpdate: AnalysisData[] = [...data];

  const reasonIdsToUpdate = new Set(allAnalysis.map((d) => d.reasonId));

  const res = analysisToUpdate.map((analysis: AnalysisData) =>
    reasonIdsToUpdate.has(analysis.reasonId)
      ? {
          ...analysis,
          loading: false,
          show: true,
          fullWidth: true,
        }
      : { ...analysis, loading: false, fullWidth: true }
  );

  return res;
};

export const showReasonAnalysis = (
  reasonIds: number[],
  _allAnalysis: AnalysisData[]
): AnalysisData[] =>
  reasonIds.map((id) => ({
    reasonId: id,
    show: true,
    fullWidth: true,
    loading: true,
  }));

export const showByReasonId = (
  analysis: AnalysisData,
  reasonId: number
): AnalysisData =>
  analysis.reasonId === reasonId
    ? { ...analysis, show: !analysis.show }
    : analysis;
