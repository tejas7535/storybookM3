import { BasicCalculationResultState } from './calculation-result-state.model';

export interface FrictionCalculationResultState
  extends BasicCalculationResultState {
  calculationResult?: FrictionCalculationResult;
  modelId?: string;
  calculationId?: string;
  isCalculationImpossible?: boolean;
}

export interface FrictionCalculationResult {
  co2_downstream?: {
    value?: number;
    unit?: string;
  };
}
