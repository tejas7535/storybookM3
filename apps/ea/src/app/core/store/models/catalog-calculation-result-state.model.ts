import { BasicCalculationResultState } from './calculation-result-state.model';

export interface CatalogCalculationResultState
  extends BasicCalculationResultState {
  result?: BasicFrequenciesResult;
}

export interface BasicFrequenciesResult {
  title: string;
  rows: BasicFrequency[];
}

export interface BasicFrequency {
  id: string;
  title: string;
  abbreviation: string;
  value: number;
  unit: string;
}
