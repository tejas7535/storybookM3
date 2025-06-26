import { AbstractControl, ValidationErrors } from '@angular/forms';

import { SelectableValue } from '../../shared/components/inputs/autocomplete/selectable-values.utils';
import { DateRange, DateRangePeriodType } from '../../shared/utils/date-range';
import {
  ResponseWithResultMessage,
  ResultMessage,
} from '../../shared/utils/error-handling';
import { GlobalSelectionCriteriaFilters } from '../global-selection/model';
import { DemandValidationStringFilter } from './demand-validation-filters';

export enum MultiType {
  List = 'list',
  Grid = 'grid',
}

export type MultiTypes = MultiType.List | MultiType.Grid;

export type DemandValidationBatchResponse = {
  id: string;
  customerNumber: string;
  materialNumber: string;
  hasMultipleEntries?: boolean;
  countErrors?: number;
  countSuccesses?: number;
  allErrors?: (ResultMessage & { id?: number })[];
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
  selectedKpis: Partial<SelectedKpis>;
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
  isValidatedForecastSynced: boolean;
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

export enum SelectedKpisAndMetadata {
  // ////////////////
  // KPIs

  // Requested KPIs
  ActiveAndPredecessor = 'activeAndPredecessor',
  Deliveries = 'deliveries',
  DemandRelevantSales = 'demandRelevantSales',
  FirmBusiness = 'firmBusiness',
  ForecastProposal = 'forecastProposal',
  ForecastProposalDemandPlanner = 'forecastProposalDemandPlanner',
  OnTopCapacityForecast = 'onTopCapacityForecast',
  OnTopOrder = 'onTopOrder',
  Opportunities = 'opportunities',
  SalesAmbition = 'salesAmbition',
  SalesPlan = 'salesPlan',
  ValidatedForecast = 'validatedForecast',
  // Confirmed KPIs
  ConfirmedDeliveries = 'confirmedDeliveries',
  ConfirmedDemandRelevantSales = 'confirmedDemandRelevantSales',
  ConfirmedFirmBusiness = 'confirmedFirmBusiness',
  ConfirmedOnTopCapacityForecast = 'confirmedOnTopCapacityForecast',
  ConfirmedOnTopOrder = 'confirmedOnTopOrder',
  ConfirmedOpportunities = 'confirmedOpportunities',
  ConfirmedSalesAmbition = 'confirmedSalesAmbition',
  ConfirmedSalesPlan = 'confirmedSalesPlan',

  // ////////////////
  // Customer Information
  CustomerClassification = 'customerClassification',
  CustomerCountry = 'customerCountry',
  GKAMName = 'gkamName',
  GKAMNumber = 'gkamNumber',
  MainCustomerName = 'mainCustomerName',
  MainCustomerNumber = 'mainCustomerNumber',
  Region = 'region',
  SalesArea = 'salesArea',
  SalesOrg = 'salesOrg',
  Sector = 'sector',
  SectorManagement = 'sectorManagement',
  SubKeyAccount = 'subKeyAccount',
  SubKeyAccountName = 'subKeyAccountName',

  // ////////////////
  // Contact Person
  AccountOwner = 'accountOwner',
  DemandPlanner = 'demandPlanner',
  GKAM = 'gkam',
  InternalSales = 'internalSales',
  KAM = 'kam',

  // ////////////////
  // Material Information
  CustomerMaterialNumber = 'customerMaterialNumber',
  DemandCharacteristic = 'demandCharacteristic',
  ForecastMaintained = 'forecastMaintained',
  ForecastValidatedAt = 'forecastValidatedAt',
  ForecastValidatedBy = 'forecastValidatedBy',
  ForecastValidatedFrom = 'forecastValidatedFrom',
  ForecastValidatedTo = 'forecastValidatedTo',
  Gpsd = 'gpsd',
  GpsdName = 'gpsdName',
  MaterialClassification = 'materialClassification',
  MaterialNumberS4 = 'materialNumberS4',
  PackagingSize = 'packagingSize',
  PortfolioStatus = 'portfolioStatus',
  PortfolioStatusDate = 'portfolioStatusDate',
  ProductCluster = 'productCluster',
  ProductLine = 'productLine',
  ProductLineText = 'productLineText',
  SuccessorCustomerMaterialDescription = 'successorCustomerMaterialDescription',
  SuccessorCustomerMaterialPackagingSize = 'successorCustomerMaterialPackagingSize',
  SuccessorMaterialCustomer = 'successorMaterialCustomer',
  SuccessorSchaefflerMaterial = 'successorSchaefflerMaterial',
  SuccessorSchaefflerMaterialDescription = 'successorSchaefflerMaterialDescription',
  SuccessorSchaefflerMaterialPackagingSize = 'successorSchaefflerMaterialPackagingSize',
  SupplyConcept = 'supplyConcept',

  // ////////////////
  // Supply Chain
  CurrentRLTSchaeffler = 'currentRLTSchaeffler',
  DeliveryPlant = 'deliveryPlant',
  FrozenZone = 'frozenZone',
  MrpGroup = 'mrpGroup',
  PlanningPlant = 'planningPlant',
  ProductionLine = 'productionLine',
  ProductionPlant = 'productionPlant',
  ProductionPlantName = 'productionPlantName',
  ProductionSegment = 'productionSegment',
}
export type SelectedKpis = Record<SelectedKpisAndMetadata, boolean>;

export interface DateRanges {
  startDatePeriod1: (
    | Date
    | ((control: AbstractControl<any, any>) => ValidationErrors)[]
  )[];
  endDatePeriod1: (
    | Date
    | ((control: AbstractControl<any, any>) => ValidationErrors)[]
  )[];
  periodType1: SelectableValue;
  startDatePeriod2: Date | null;
  endDatePeriod2: Date | null;
  periodType2: SelectableValue;
}

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
