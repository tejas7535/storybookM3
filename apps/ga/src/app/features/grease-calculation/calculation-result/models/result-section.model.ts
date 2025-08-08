import { LabelValue } from '@schaeffler/label-value';

import {
  GreaseSelectionResult,
  InitialLubricationResult,
  PerformanceResult,
  RelubricationResult,
} from './grease-result.model';

export interface ResultSection {
  title: string;
  mainValue?: string;
  badgeText: string;
  badgeSecondaryText?: string;
  badgeClass?: string;
  concept1: boolean;
  extendable: boolean;
  labelValues?: LabelValue[];
}

export enum ResultSectionType {
  'INITIAL_LUBRICATION' = 'initialLubrication',
  'PERFORMANCE' = 'performance',
  'RELUBRICATION' = 'relubrication',
  'GREASE_SELECTION' = 'greaseSelection',
}

export type ResultSectionData = {
  [key in ResultSectionType]: ResultSection;
};

export type ResultSectionRaw =
  | InitialLubricationResult
  | PerformanceResult
  | RelubricationResult
  | GreaseSelectionResult;

export type InitialResultSectionData = {
  [key in ResultSectionType]: Partial<ResultSection>;
};
