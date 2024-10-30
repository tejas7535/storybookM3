import { SortModelItem } from 'ag-grid-community';

import { ResponseWithResultMessage } from '../../shared/utils/error-handling';
import {
  DemandCharacteristic,
  MaterialClassification,
} from '../material-customer/model';
import { DemandPlanAdoption } from './cmp-modal-types';

/* Singe Phase In*/
export interface CMPSinglePhaseInRequest {
  customerNumber: string;
  materialNumber: string;
  /**
   * format is iso date string YYYY-MM-DDs
   */
  phaseInDate: string;
  demandCharacteristic: string;
}

export type CMPSinglePhaseInResponse = {
  customerNumber: string;
  materialNumber: string;
} & ResponseWithResultMessage;

/* Single Substitution*/
export type CMPSingleSubstitutionResponse = {
  customerNumber: string;
  materialNumber: string;
  confirmationNeeded: boolean;
} & ResponseWithResultMessage;

/* Bulk Phase In*/
export interface CMPBulkPhaseInRequest {
  customerNumber: string;
  phaseInEntities: CMPBulkPhaseInEntity[];
}

export interface CMPBulkPhaseInEntity {
  materialNumber: string;
  /**
   * format is iso date string YYYY-MM-DDs
   */
  phaseInDate: string;
  demandCharacteristic: string;
}

export interface CMPBulkPhaseInResponse {
  customerNumber: string;
  materialResults: CMPMaterialPhaseInResponse[];
}

export type CMPMaterialPhaseInResponse = {
  materialNumber: string;
} & ResponseWithResultMessage;

export interface CMPErrorMessage {
  materialNumber?: string;
  errorMessage: string;
}

/* Update CMPMaterial*/
export interface CMPWriteRequest {
  customerNumber: string;
  materialNumber: string;
  autoSwitchDate: string | null;
  repDate: string | null;
  portfolioStatus: string;
  demandCharacteristic: string | null;
  successorMaterial: string | null;
  demandPlanAdoption: DemandPlanAdoption | null;
}

export type CMPWriteResponse = {
  customerNumber: string;
  materialNumber: string;
} & ResponseWithResultMessage;

export interface CMPEntry {
  region?: string;
  salesArea?: string;
  sectorManagement?: string;
  salesOrg?: string;
  gkamNumber?: string;
  customerNumber?: string;
  materialNumber?: string;
  materialClassification?: MaterialClassification;
  sector?: string;
  productionSegment?: string;
  alertType?: string;
  materialDescription?: string;
  customerMaterialNumber?: string;
  customerMaterialNumberCount?: number;
  packagingSize?: number;
  productionPlant?: string;
  productionLine?: string;
  demandCharacteristic?: DemandCharacteristic;
  portfolioStatus?: string;
  pfStatusAutoSwitch?: string;
  repDate?: string;
  entryValidFrom?: string;
  stochasticType?: string;
  productLine?: string;
  productLineText?: string;
  deliveryQuantity18Months?: number;
  orderQuantity?: number;
  successorMaterial?: string;
  successorMaterialDescription?: string;
  successorCustomerMaterialNumber?: string;
  successorCustomerMaterialNumberCount?: number;
  successorMaterialPackagingSize?: number;
  successorMaterialClassification?: MaterialClassification;
  successorStochasticType?: string;
  successorProductionPlant?: string;
  successorProductionSegment?: string;
  successorProductionLine?: string;
  successorProductLine?: string;
  successorProductLineText?: string;
  successorSchaefflerMaterial?: string;
  successorSchaefflerMaterialDescription?: string;
  successorSchaefflerMaterialPackagingSize?: number;
  hasChildren?: boolean;
  tlMessageType: string | null;
  tlMessage: string | null;
  tlMessageNumber: number | null;
  tlMessageId: string | null;
  tlMessageV1: string | null;
  tlMessageV2: string | null;
  tlMessageV3: string | null;
  tlMessageV4: string | null;
}

export interface CfcrActionRequest {
  customerNumber: string;
  materialNumber: string;
  successorMaterial: string;
}

export interface CfcrActionResponse {
  cfcrActions: [
    {
      materialNumber: string;
      customerNumber: string;
      successorMaterial: string;
      cfcrAction: DemandPlanAdoption;
      selected: boolean;
    },
  ];
}

export interface CMPRequest {
  startRow: number | undefined;
  endRow: number | undefined;
  sortModel: SortModelItem[];
  selectionFilters: any;
  columnFilters: Record<string, any>;
}

export interface CMPResponse {
  headMaterials: { rows: CMPEntry[]; rowCount: number };
  childOfHeadMaterial: Map<string, CMPEntry[]>;
}
