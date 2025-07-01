import { AnalysisData } from './analysis-data.model';
import { ChartGeneralQuestionsAnalysis } from './chart-general-analysis.model';

export interface GeneralQuestionsGridData {
  chart?: ChartGeneralQuestionsAnalysis;
  reasonAnalysis: {
    question: string;
    reasons: AnalysisData[];
  };
}
