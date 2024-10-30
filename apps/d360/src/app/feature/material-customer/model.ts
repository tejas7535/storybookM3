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
  currentRLTSchaeffler?: string;
  currentRLTCustomer?: string;
  portfolioStatus?: string;
  stochasticType?: string;
  successorSchaefflerMaterial?: string;
  successorSchaefflerMaterialDescription?: string;
  successorSchaefflerMaterialPackagingSize?: number;
  successorMaterialClassificationSchaeffler?: string;
  successorMaterialCustomer?: string;
  successorCustomerMaterialDescription?: string;
  successorCustomerMaterialPackagingSize?: number;
  successorMaterialClassificationCustomer?: string;
  pfStatusAutoSwitch?: string;
  repDate?: string;
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
  forecastValidated?: string;
  forecastValidatedFrom?: string;
  forecastValidatedTo?: string;
  forecastValidatedAt?: string;
  forecastValidatedBy?: string;
  abcxClassification?: string;
  gpsd?: string;
  gpsdName?: string;
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

export const materialClassifications = ['AP', 'SPs', 'SPc', 'OP'] as const;

export type MaterialClassification = (typeof materialClassifications)[number];

export const abcxClassifications = ['A', 'B', 'C', 'X', ''] as const;

export type AbcxClassification = (typeof abcxClassifications)[number];

/**
 * SE - series
 * SP - sporadic
 */
export const demandCharacteristics = ['SE', 'SP'] as const;

export type DemandCharacteristic = (typeof demandCharacteristics)[number];
