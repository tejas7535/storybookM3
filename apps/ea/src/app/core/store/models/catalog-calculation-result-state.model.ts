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
    warnings: string[];
    errors: string[];
    notes: string[];
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
    key: 'lowerGuideIntervalServiceLife',
    short: 'tfG_min',
  },
  {
    key: 'upperGuideIntervalServiceLife',
    short: 'tfG_max',
  },
  {
    key: 'lowerGuideIntervalRelubrication',
    short: 'tfR_min',
  },
  {
    key: 'upperGuideIntervalRelubrication',
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
  // tfG_min (Lower guide value for grease service life)
  lowerGuideIntervalServiceLife?: ResultItem;
  // tfG_max (Upper guide value for grease service life)
  upperGuideIntervalServiceLife?: ResultItem;
  // tfR_min (Lower guide value for relubrication interval)
  lowerGuideIntervalRelubrication?: ResultItem;
  // tfR_max (Upper guide value for relubrication interval)
  upperGuideIntervalRelubrication?: ResultItem;
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
