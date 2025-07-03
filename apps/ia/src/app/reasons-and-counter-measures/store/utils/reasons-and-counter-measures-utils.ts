import { AnalysisData } from '../../models/analysis-data.model';

export const updateReasonAnalysisDataOnSuccess = (
  data: AnalysisData[],
  allAnalysis: AnalysisData[]
): AnalysisData[] => {
  if (!allAnalysis) {
    return mapWithDefaultState(data, { show: false, fullWidth: true });
  }

  if (!data) {
    return mapWithDefaultState(allAnalysis, { show: false, fullWidth: false });
  }

  const reasonIdsToUpdate = new Set(
    allAnalysis.map((analysis) => analysis.reasonId)
  );

  return data.map((analysis: AnalysisData) => ({
    ...analysis,
    loading: false,
    show: reasonIdsToUpdate.has(analysis.reasonId),
    fullWidth: true,
  }));
};

const mapWithDefaultState = (
  items: AnalysisData[],
  defaults: Partial<AnalysisData>
): AnalysisData[] =>
  items.map((item) => ({
    ...item,
    loading: false,
    ...defaults,
  }));

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
