import { DateRange, DateRangePeriodType } from '../../shared/utils/date-range';
import { ResponseWithResultMessage } from '../../shared/utils/error-handling';
import { GlobalSelectionCriteriaFilters } from '../global-selection/model';
import { DemandValidationStringFilter } from './demand-validation-filters';

export type DemandValidationBatchResponse = {
  id: string;
  customerNumber: string;
  materialNumber: string;
  hasMultipleEntries: boolean;
  hasSuccessEntries: boolean;
  hasErrorEntries: boolean;
} & ResponseWithResultMessage;

export interface DemandValidationBatch {
  id: string;
  material: string;
  dateString: string;
  forecast: string;
  periodType: string;
  kpiEntries?: WriteKpiEntry[];
}

export interface BucketRequest {
  range1: KpiDataRequestDateRange;
  range2?: KpiDataRequestDateRange;
}

export interface KpiDataRequest {
  selectedKpis: SelectedKpis;
  customerNumber: string;
  materialNumber: string;
  range1: KpiDataRequestDateRange;
  range2?: KpiDataRequestDateRange;
  exceptions: string[];
}

export interface KpiDataRequestDateRange {
  from: string;
  to: string;
  period: DateRangePeriodType;
}

export type MaterialType = 'schaeffler' | 'customer';

export enum KpiBucketTypeEnum {
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  PARTIAL_WEEK = 'PARTIAL_WEEK',
}

export type KpiBucketType =
  (typeof KpiBucketTypeEnum)[keyof typeof KpiBucketTypeEnum];

export interface MaterialListEntry {
  accountOwner?: string;
  alertType?: string;
  currency?: string;
  currentRLTSchaeffler?: string;
  customerClassification?: string;
  customerCountry?: string;
  customerMaterialNumber?: string;
  customerMaterialNumberCount?: number;
  customerName?: string;
  customerNumber?: string;
  dateBeginMaintPossibleMonth?: string;
  dateBeginMaintPossibleWeek?: string;
  dateEndMaintPossibleMonth?: string;
  dateEndMaintPossibleWeek?: string;
  dateFrozenZoneDl?: string;
  dateRltDl?: string;
  deliveryPlant?: string;
  demandCharacteristic?: string;
  demandPlanner?: string;
  demandPlanQuantity?: number;
  demandPlanQuantityUnit?: string;
  demandPlanValue?: number;
  dispoGroup?: string;
  fixHor?: string;
  frozenZone?: number;
  gkam?: string;
  gkamNumber?: string;
  gpsd?: string;
  gpsdName?: string;
  internalSales?: string;
  kam?: string;
  keyAccountName?: string;
  language?: string;
  mainCustomerName?: string;
  mainCustomerNumber?: string;
  materialClassification?: string;
  materialDescription?: string;
  materialNumber?: string;
  materialNumberS4?: string;
  packagingSize?: number;
  planningPlant?: string;
  portfolioStatus?: string;
  portfolioStatusDate?: string;
  productCluster?: string;
  productionLine?: string;
  productionPlant?: string;
  productionPlantName?: string;
  productionSegment?: string;
  productLine?: string;
  productLineName?: string;
  region?: string;
  safetyStock?: number;
  safetyStockCustomer?: number;
  salesArea?: string;
  salesOrg?: string;
  sector?: string;
  sectorDescription?: string;
  sectorManagement?: string;
  sectorManagementText?: string;
  stochasticType?: string;
  subKeyAccount?: string;
  subKeyAccountName?: string;
  successorCustomerMaterial?: string;
  successorCustomerMaterialDescription?: string;
  successorSchaefflerMaterial?: string;
  successorSchaefflerMaterialDescription?: string;
  transitTimeBetweenProdPlantAndDistributionPlant?: number;
}

export interface KpiEntry {
  bucketType: KpiBucketType;
  confirmedSalesPlan: number | null;
  confirmedDeliveriesActive: number | null;
  confirmedDeliveriesCombined: number | null;
  confirmedDeliveriesPredecessor: number | null;
  confirmedDemandPlan: number | null;
  confirmedDemandRelevantSales: number | null;
  confirmedFirmBusinessActive: number | null;
  confirmedFirmBusinessCombined: number | null;
  confirmedFirmBusinessPredecessor: number | null;
  confirmedOnTopCapacityForecast: number | null;
  confirmedOnTopOrder: number | null;
  confirmedOpportunities: number | null;
  confirmedSalesAmbition: number | null;
  currentDemandPlan: number | null;
  salesPlan: number | null;
  deliveriesActive: number | null;
  deliveriesCombined: number | null;
  deliveriesPredecessor: number | null;
  demandRelevantSales: number | null;
  firmBusinessActive: number | null;
  firmBusinessCombined: number | null;
  firmBusinessPredecessor: number | null;
  forecastProposal: number | null;
  forecastProposalDemandPlanner: number | null;
  fromDate: string;
  indicativeDemandPlan: number | null;
  onTopCapacityForecast: number | null;
  onTopOrder: number | null;
  opportunities: number | null;
  salesAmbition: number | null;
  storedBucketType: KpiBucketType | null;
  toDate: string;
  validatedForecast: number | null;
}

export interface KpiData {
  customerNumber: string;
  materialNumber: string;
  data: KpiEntry[];
}

export interface KpiDateRanges {
  range1: DateRange;
  range2?: DateRange;
}

export interface KpiBucket {
  from: string;
  to: string;
  type: KpiBucketType;
}

export interface WriteKpiData {
  ids?: string[];
  customerNumber: string;
  materialNumber: string;
  kpiEntries: WriteKpiEntry[];
}

export interface WriteKpiEntry {
  idx?: number;
  fromDate: string | null;
  bucketType: KpiBucketType;
  validatedForecast: number | null;
}

export interface WriteKpiDataResponse {
  ids?: string[];
  customerNumber: string;
  materialNumber: string;
  results: WriteKpiEntryResult[];
}

export type WriteKpiEntryResult = {
  idx?: number;
  fromDate: string;
} & ResponseWithResultMessage;

export enum KpiType {
  ActiveAndPredecessor = 'activeAndPredecessor',
  Deliveries = 'deliveries',
  FirmBusiness = 'firmBusiness',
  Opportunities = 'opportunities',
  ForecastProposal = 'forecastProposal',
  ForecastProposalDemandPlanner = 'forecastProposalDemandPlanner',
  ValidatedForecast = 'validatedForecast',
  DemandRelevantSales = 'demandRelevantSales',
  OnTopOrder = 'onTopOrder',
  OnTopCapacityForecast = 'onTopCapacityForecast',
  SalesAmbition = 'salesAmbition',
  SalesPlan = 'salesPlan',
  ConfirmedDeliveries = 'confirmedDeliveries',
  ConfirmedFirmBusiness = 'confirmedFirmBusiness',
  ConfirmedDemandRelevantSales = 'confirmedDemandRelevantSales',
  ConfirmedOnTopOrder = 'confirmedOnTopOrder',
  ConfirmedOnTopCapacityForecast = 'confirmedOnTopCapacityForecast',
  ConfirmedSalesAmbition = 'confirmedSalesAmbition',
  ConfirmedOpportunities = 'confirmedOpportunities',
  ConfirmedSalesPlan = 'confirmedSalesPlan',
}
export type SelectedKpis = Record<KpiType, boolean>;

export interface DeleteKpiDataRequest {
  customerNumber: string;
  fromDate: string;
  toDate: string;
  materialNumbers: string[];
}

export type DeleteKpiDataResponse = {
  customerNumber: string;
  fromDate: string;
  toDate: string;
  results: DeleteKpiEntryResult[];
} & ResponseWithResultMessage;

export type DeleteKpiEntryResult = {
  materialNumber: string;
} & ResponseWithResultMessage;

export interface DemandMaterialCustomerRequest {
  selectionFilters:
    | (GlobalSelectionCriteriaFilters & DemandValidationStringFilter)
    | undefined;
  startRow: number;
  endRow: number;
  sortModel: object[];
}

export const SUPPLY_CONCEPT_SUPPORTED_STOCHASTIC_TYPES = [
  'C',
  'E',
  'F',
  'S',
  'U',
  'M',
  'N',
] as const;

export type SupplyConceptsStochasticType =
  (typeof SUPPLY_CONCEPT_SUPPORTED_STOCHASTIC_TYPES)[number];
