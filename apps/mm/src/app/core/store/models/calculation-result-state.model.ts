import { CalculationResultReportInput } from './calculation-result-report-input.model';

export interface CalculationResultState {
  isLoading: boolean;
  result?: CalculationResult;
  error?: string;
}

export interface CalculationResult {
  inputs: CalculationResultReportInput[];
  startPositions: ResultItem[];
  endPositions: ResultItem[];
  mountingTools: MountingTools;
  mountingRecommendations: string[];
  radialClearance: ResultItemWithTitle[];
  clearanceClasses: ResultItemWithTitle[];
  reportMessages: ReportMessages;
}

export interface ResultItem {
  value: string;
  unit: string;
  abbreviation?: string;
  designation: string;
}

export interface ResultItemWithTitle {
  title: string;
  items: ResultItem[];
}

export interface PumpItem {
  field: string;
  value: string;
  isRecommended: boolean;
}

export interface MountingTools {
  additionalTools: ResultItem[];
  hydraulicNut: ResultItem[];
  pumps: PumpItem[];
  locknut: ResultItem[];
  sleveConnectors: ResultItem[];
}

export interface ReportMessages {
  warnings: string[];
  errors: string[];
  notes: string[];
}
