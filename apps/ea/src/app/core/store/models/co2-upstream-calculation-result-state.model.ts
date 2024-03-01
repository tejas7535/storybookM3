import { BasicCalculationResultState } from './calculation-result-state.model';

export interface CO2UpstreamCalculationResultState
  extends BasicCalculationResultState {
  calculationResult?: CO2UpstreamCalculationResult;
}

export interface CO2UpstreamCalculationResult {
  weight: number;
  upstreamEmissionFactor: number;
  upstreamEmissionTotal: number;
  unit: string;
}

export interface Co2ApiSearchResult {
  bearinxId: string;
  epimId: string;
  designation: string;
}
