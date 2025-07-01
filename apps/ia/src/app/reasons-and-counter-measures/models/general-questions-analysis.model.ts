import { AnalysisData, ChartGeneralQuestionsAnalysis } from '.';

export interface GeneralQuestionsAnalysis {
  title?: string;
  chart?: ChartGeneralQuestionsAnalysis;
  reasonAnalysis?: {
    question: string;
    data: AnalysisData[];
  }[];
}
