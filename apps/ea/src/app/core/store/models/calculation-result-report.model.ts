import { CalculationParametersCalculationTypeConfig } from './calculation-parameters-state.model';

export type CalculationResultReportCalculationTypeSelection =
  (CalculationParametersCalculationTypeConfig & { resultAvailable: boolean })[];

export interface LoadcaseResultCombinedItem {
  value?: number | string;
  loadcaseValues?: {
    value?: string | number;
    loadcaseName: string;
  }[];
  warning?: string;
  unit: string;
  title: string;
  short?: string;
}
