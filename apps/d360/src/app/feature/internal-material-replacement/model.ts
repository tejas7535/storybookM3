import { ResponseWithResultMessage } from '../../shared/utils/error-handling';
import { GlobalSelectionCriteriaFilters } from '../global-selection/model';

export const replacementTypeValues = [
  'RELOCATION',
  'PARTIAL_RELOCATION',
  'PACKAGING_CHANGE',
  'PRODUCT_DEVELOPMENT',
  'DISCONTINUED',
  'CUSTOMER_DROPOUT',
] as const;

export type ReplacementType = (typeof replacementTypeValues)[number];

export interface IMRRequest {
  selectionFilters: GlobalSelectionCriteriaFilters;
  columnFilters: Record<string, any>;
  startRow: number;
  endRow: number;
  sortModel: object[];
}

export interface IMRSubstitution {
  replacementType: ReplacementType | null;
  region: string;
  salesArea: string | null;
  salesOrg: string | null;
  customerNumber: string | null;
  predecessorMaterial: string | null;
  successorMaterial: string | null;
  replacementDate: Date | string | null;
  cutoverDate: Date | string | null;
  startOfProduction: Date | string | null;
  note: string | null;
}

export interface IMRSubstitutionRequest {
  replacementType: string;
  region: string;
  salesArea: string | null;
  salesOrg: string | null;
  customerNumber: string | null;
  predecessorMaterial: string | null;
  successorMaterial: string | null;
  replacementDate: string | null;
  cutoverDate: string | null;
  startOfProduction: string | null;
  note: string | null;
}

export type IMRSubstitutionResponse = {
  replacementType: ReplacementType | null;
  region: string;
  salesArea: string | null;
  salesOrg: string | null;
  customerNumber: string | null;
  predecessorMaterial: string | null;
} & ResponseWithResultMessage;
