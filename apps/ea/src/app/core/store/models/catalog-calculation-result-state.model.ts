import { CatalogServiceProductClass } from '@ea/core/services/catalog.service.interface';

import { CalculationResultReportInput } from './calculation-result-report-input.model';
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
  reportInputSuborinates?: {
    inputSubordinates: CalculationResultReportInput[];
  };

  reportMessages?: {
    // messages contains Erros, Warnings and Notes if available
    messages: ReportMessage[];
  };

  calculationError?: {
    error: string;
  };

  bearingBehaviour?: BearingBehaviour;

  // P0 and P_i values only for multiple loadcases
  loadcaseFactorsAndEquivalentLoads?: {
    [key: string]: LoadcaseNumberResultItem;
  }[];

  loadcaseOverrollingFrequencies?: {
    [key: string]: LoadcaseStringResultItem;
  }[];

  loadcaseLubrication?: {
    [key: string]: LoadcaseNumberResultItem;
  }[];

  loadcaseFriction?: {
    [key: string]: LoadcaseResultItem;
  }[];
}

export const OverrollingFrequencyKeys: string[] = [
  'BPFI',
  'BPFO',
  'BSF',
  'FTF',
  'RPFB',
];
export const OverrollingPreviewKeys: string[] = ['BPFI', 'BPFO', 'BSF', 'RPFB'];

export const factorsAndEquivalentsKeys: string[] = ['P0', 'P_i'];

export const lubricationBearingBehaviourItems: {
  key: string;
  short: string;
}[] = [
  {
    key: 'lowerGuideInterval',
    short: 'tfR_min',
  },
  {
    key: 'upperGuideInterval',
    short: 'tfR_max',
  },
];

export interface ResultItem {
  value: string;
  unit?: string;
  warning?: string;
}

export interface LoadcaseResultItem {
  value: number | string;
  unit?: string;
  short?: string;
  loadcaseName: string;
  title: string;
  warning?: string;
}

export interface LoadcaseStringResultItem extends LoadcaseResultItem {
  value: string;
}

export interface LoadcaseNumberResultItem extends LoadcaseResultItem {
  value: number;
}

export interface BearingBehaviour {
  /** Rating Life (nominal) */
  lh10?: ResultItem;
  /** Modified Rating Life in hours */
  lh_nm?: ResultItem;
  /** Equivalent Dynamic Load */
  p?: ResultItem;
  /** Equivalent Speed */
  n?: ResultItem;
  /** Static Safety */
  S0_min?: ResultItem;
  /** Maximum Equivalent Static Load */
  P0_max?: ResultItem;
  // tfR_min (Lower guide value for relubrication interval)
  lowerGuideInterval?: ResultItem;
  // tfR_max (Upper guide value for relubrication interval)
  upperGuideInterval?: ResultItem;
}

export interface BasicFrequency {
  id: string;
  title: string;
  abbreviation: string;
  value: number;
  unit: string;
}

export interface ReportMessage {
  title?: string;
  item?: {
    messages?: string[];
    subItems?: ReportMessage[];
  };
}

export interface ProductCapabilitiesResult {
  productInfo: {
    designation: string;
    id: string;
    bearinxClass: CatalogServiceProductClass;
  };
  capabilityInfo: {
    frictionCalculation: boolean;
  };
}
