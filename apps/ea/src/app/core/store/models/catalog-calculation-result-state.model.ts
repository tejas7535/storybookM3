import { BasicCalculationResultState } from './calculation-result-state.model';

export interface CatalogCalculationResultState
  extends BasicCalculationResultState {
  basicFrequencies?: BasicFrequenciesResult;
  result?: CatalogCalculationResult;
}

export interface BasicFrequenciesResult {
  title: string;
  rows: BasicFrequency[];
}

export interface CatalogCalculationResult {
  lh10?: {
    value: string;
    unit: string;
  };
}

export interface BasicFrequency {
  id: string;
  title: string;
  abbreviation: string;
  value: number;
  unit: string;
}
