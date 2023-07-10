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
  /** Rating Life (nominal) */
  lh10?: {
    value: string;
    unit: string;
  };
  /** Modified Rating Life in hours */
  lh_nm?: {
    value: string;
    unit: string;
  };
  /** Equivalent Dynamic Load */
  p?: {
    value: string;
    unit: string;
  };
  /** Equivalent Speed */
  n?: {
    value: string;
    unit: string;
  };
  /** Static Safety */
  S0_min?: {
    value: string;
    unit: string;
  };
  /** Maximum Equivalent Static Load */
  P0_max?: {
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
