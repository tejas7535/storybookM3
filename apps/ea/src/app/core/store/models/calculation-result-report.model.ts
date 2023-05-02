import { CalculationParametersCalculationTypeConfig } from './calculation-parameters-state.model';

export type CalculationResultReportCalculationTypeSelection =
  (CalculationParametersCalculationTypeConfig & { resultAvailable: boolean })[];
