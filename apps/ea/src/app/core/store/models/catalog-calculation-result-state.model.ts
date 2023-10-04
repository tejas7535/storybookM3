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

  BPFO?: {
    value: string;
    unit: string;
  };

  BPFI?: {
    value: string;
    unit: string;
  };

  BSF?: {
    value: string;
    unit: string;
  };

  RPFB?: {
    value: string;
    unit: string;
  };

  FTF?: {
    value: string;
    unit: string;
  };

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

  speedDependentFrictionalTorque?: {
    // M0 (Speed-dependent frictional torque)
    value: number;
    unit: string;
  };
  loadDependentFrictionalTorque?: {
    // M1 (Load-dependent frictional torque)
    value: number;
    unit: string;
  };
  totalFrictionalTorque?: {
    // MR (Total frictional torque)
    value: number;
    unit: string;
  };
  totalFrictionalPowerLoss?: {
    // NR (Total frictional power loss)
    value: number;
    unit: string;
  };
  thermallySafeOperatingSpeed?: {
    // n_theta (Thermally safe operating speed)
    value: number;
    unit: string;
  };
  operatingViscosity?: {
    // ny (operating viscosity)
    value: number;
    unit: string;
  };
  referenceViscosity?: {
    // ny1 (reference viscosity)
    value: number;
    unit: string;
  };
  viscosityRatio?: {
    // kappa (Viscosity ratio)
    value: number;
    unit: string;
  };
  lifeAdjustmentFactor?: {
    // a_ISO (Life adjustment factor)
    value: number;
    unit: string;
  };
  lowerGuideInterval?: {
    // tfR_min (Lower guide value for relubrication interval)
    value: string;
    unit: string;
  };
  upperGuideInterval?: {
    // tfR_max (Upper guide value for relubrication interval)
    value: string;
    unit: string;
  };
}

export const OverrollingFrequencyKeys: string[] = [
  'BPFI',
  'BPFO',
  'BSF',
  'FTF',
  'RPFB',
];
export const OverrollingPreviewKeys: string[] = ['BPFI', 'BPFO', 'BSF', 'RPFB'];

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
