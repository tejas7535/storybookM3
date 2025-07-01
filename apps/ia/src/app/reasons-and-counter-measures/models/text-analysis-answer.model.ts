import { AnalysisData } from './analysis-data.model';
import { GeneralQuestionsAnalysis } from './general-questions-analysis.model';

export interface TextAnalysisAnswer {
  reasons: AnalysisData[];
  generalQuestions: GeneralQuestionsAnalysis;
}
