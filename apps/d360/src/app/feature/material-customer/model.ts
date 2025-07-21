import { GlobalSelectionCriteriaFilters } from '../global-selection/model';

export interface MaterialCustomerEntry {
  id?: string;
  region?: string;
  salesArea?: string;
  salesOrg?: string;
  mainCustomerNumber?: string;
  mainCustomerName?: string;
  customerNumber?: string;
  customerName?: string;
  customerCountry?: string;
  sector?: string;
  sectorManagement?: string;
  customerClassification?: string;
  deliveryPlant?: string;
  planningPlant?: string;
  materialNumber?: string;
  materialDescription?: string;
  mrpGroup?: string;
  productionPlant?: string;
  productionPlantName?: string;
  productionSegment?: string;
  productionLine?: string;
  productionLineText?: string;
  packagingSize?: number;
  customerMaterialNumber?: string;
  customerMaterialNumberCount?: number;
  materialClassification?: MaterialClassification;
  demandCharacteristic?: DemandCharacteristic;
  currentRLTSchaeffler?: number;
  currentRLTCustomer?: number;
  portfolioStatus?: string;
  stochasticType?: string;
  successorSchaefflerMaterial?: string;
  successorSchaefflerMaterialDescription?: string;
  successorSchaefflerMaterialPackagingSize?: number;
  successorMaterialCustomer?: string;
  successorCustomerMaterialDescription?: string;
  successorCustomerMaterialPackagingSize?: number;
  portfolioStatusAutoSwitch?: string;
  replacementDate?: string;
  accountOwner?: string;
  accountOwnerID?: string;
  internalSales?: string;
  internalSalesID?: string;
  demandPlanner?: string;
  demandPlannerID?: string;
  gkam?: string;
  gkamID?: string;
  kam?: string;
  kamID?: string;
  gkamNumber?: string;
  gkamName?: string;
  subKeyAccount?: string;
  subKeyAccountName?: string;
  productLine?: string;

  forecastMaintained?: boolean;
  forecastValidated?: number;
  forecastValidatedFrom?: string;
  forecastValidatedTo?: string;
  forecastValidatedAt?: string;
  forecastValidatedBy?: string;
  abcxClassification?: string;
  gpsd?: string;
  gpsdName?: string;
  division?: string;
  portfolioStatusDate?: string;
  statusValidFromDate?: string;
  alertType?: string;
  fixHor?: string;
  safetyStock?: number;
  portfolioStatusValidFrom?: string;
  safetyStockCustomer?: number;
  productCluster?: string;
  materialNumberS4?: string;
  frozenZone?: string;
  fixhorDays?: number;
  materialClassificationCore?: string;
}

export interface CriteriaFields {
  filterableFields: string[];
  sortableFields: string[];
}

export interface MaterialCustomerSelectionFilters {
  id?: string[];
  region?: string[];
  salesArea?: string[];
  sectorManagement?: string[];
  salesOrg?: string[];
  gkamNumber?: string[];
  customerNumber?: string[];
  materialNumber?: string[];
}

export interface MaterialCustomerRequest {
  selectionFilters: GlobalSelectionCriteriaFilters;
  columnFilters: Record<string, any>[];
  endRow: number;
}

export interface MaterialCustomerCustomerRequest {
  selectionFilters: GlobalSelectionCriteriaFilters | undefined;
  columnFilters: Record<string, any>;
  startRow: number;
  endRow: number;
  sortModel: object[];
}

export enum MaterialClassificationType {
  AP = 'AP',
  SP = 'SP',
  SPS = 'SPs',
  SPC = 'SPc',
  OP = 'OP',
}

export const materialClassificationOptions = [
  MaterialClassificationType.AP,
  MaterialClassificationType.SPS,
  MaterialClassificationType.SPC,
  MaterialClassificationType.OP,
];

export type MaterialClassification =
  (typeof materialClassificationOptions)[number];

export const abcxClassificationOptions = ['A', 'B', 'C', 'X', ''] as const;

export type AbcxClassification = (typeof abcxClassificationOptions)[number];

/**
 * SE - series
 * SP - sporadic
 */
export const demandCharacteristicOptions = ['SE', 'SP'];

export type DemandCharacteristic = (typeof demandCharacteristicOptions)[number];
