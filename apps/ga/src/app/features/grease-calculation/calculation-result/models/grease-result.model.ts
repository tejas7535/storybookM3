import { GreaseReportSubordinate } from './grease-report-subordinate.model';

export interface GreaseResultDataItem {
  title: string;
  tooltip?: string;
  values?: string;
  custom?: {
    selector: string;
    data?: any;
  };
}

export type GreaseResultDataSourceItem = GreaseResultDataItem | undefined;

export type GreaseResultData = GreaseResultDataSourceItem[];

export interface PreferredGreaseResult {
  id: string;
  text: string;
}

export interface GreaseResultItem<T = string | number> {
  title: string;
  value: T;
  prefix?: string;
  unit?: string;
  secondaryValue?: T;
  secondaryPrefix?: string;
  secondaryUnit?: string;
  tooltip?: string;
}

export interface InitialLubricationResult {
  initialGreaseQuantity: GreaseResultItem<number>;
}

export interface PerformanceResult {
  viscosityRatio: GreaseResultItem<number>;
  additiveRequired: GreaseResultItem<string>;
  effectiveEpAdditivation: GreaseResultItem<string>;
  lowFriction: GreaseResultItem<string>;
  suitableForVibrations: GreaseResultItem<string>;
  supportForSeals: GreaseResultItem<string>;
}

export interface RelubricationResult {
  relubricationQuantityPer1000OperatingHours: GreaseResultItem<number>;
  relubricationPer365Days: GreaseResultItem<number>;
  relubricationPer30Days: GreaseResultItem<number>;
  relubricationPer7Days: GreaseResultItem<number>;
  concept1: GreaseResultDataItem;
  maximumManualRelubricationPerInterval: GreaseResultItem<number>;
  relubricationInterval: GreaseResultItem<number>;
}

export interface GreaseSelectionResult {
  greaseServiceLife: GreaseResultItem<number>;
  baseOilViscosityAt40: GreaseResultItem<number>;
  lowerTemperatureLimit: GreaseResultItem<number>;
  upperTemperatureLimit: GreaseResultItem<number>;
  density: GreaseResultItem<number>;
  h1Registration: GreaseResultItem<string>;
}

export interface GreaseResult {
  mainTitle: string;
  subTitle?: string;
  isSufficient: boolean;
  isPreferred?: boolean;
  isRecommended?: boolean;
  isMiscible?: boolean;
  initialLubrication: InitialLubricationResult;
  performance: PerformanceResult;
  relubrication: RelubricationResult;
  greaseSelection: GreaseSelectionResult;
}

export interface GreaseResultReport {
  inputs: GreaseReportSubordinate;
  greaseResult?: GreaseResult[];
  errorWarningsAndNotes: GreaseReportSubordinate;
  legalNote?: string;
}
