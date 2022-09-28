import { SUITABILITY_LABEL } from './grease-report-concept1.model';

export enum GreaseSuitabilityLevels {
  'ExtremelySuitable' = '++',
  'HighlySuitable' = '+',
  'Suitable' = '0',
  'LessSuitable' = '-',
  'NotSuitable' = '--',
}

export type GreaseSuitabilityLevelsSetting = {
  [key in `${GreaseSuitabilityLevels}`]: keyof typeof GreaseSuitabilityLevels;
};

export interface GreaseConcep1Suitablity {
  hint: string;
  label: SUITABILITY_LABEL;
  c1_60: number;
  c1_125: number;
}
