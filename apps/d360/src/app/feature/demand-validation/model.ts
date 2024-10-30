import { DateRange, DateRangePeriod } from '../../shared/utils/date-range';
import {
  ResponseWithResultMessage,
  ResultMessage,
} from '../../shared/utils/error-handling';
import { GlobalSelectionCriteriaFilters } from '../global-selection/model';
import { DemandValidationStringFilter } from './demand-validation-filters';

export type ValidatedDemandBatchErrorMessages = Record<
  string,
  ResultMessage[] | undefined
>;

export interface ValidatedDemandBatchResult {
  savedCount: number;
  errorMessages: ValidatedDemandBatchErrorMessages;
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
  period: DateRangePeriod;
}

export type MaterialType = 'schaeffler' | 'customer';

export type KpiBucketType = 'WEEK' | 'MONTH' | 'PARTIAL_WEEK';

export interface MaterialListEntry {
  region?: string;
  salesArea?: string;
  salesOrg?: string;
  gkamNumber?: string;
  customerNumber?: string;
  materialNumber?: string;
  materialClassification?: string;
  sector?: string;
  productionSegment?: string;
  alertType?: string;
  materialDescription?: string;
  customerMaterialNumber?: string;
  customerMaterialNumberCount?: number;
  productLine?: string;
  productionPlant?: string;
  productionLine?: string;
  stochasticType?: string;
  currentRLTSchaeffler?: string;
  demandPlanValue?: number;
  fixHor?: string;
  eisbeDl?: number;
  zv98QtyDl?: number;
}

export interface KpiEntry {
  fromDate: string;
  bucketType: KpiBucketType;
  storedBucketType: KpiBucketType | null;
  deliveriesCombined: number | null;
  deliveriesActive: number | null;
  deliveriesPredecessor: number | null;
  firmBusinessCombined: number | null;
  firmBusinessActive: number | null;
  firmBusinessPredecessor: number | null;
  opportunities: number | null;
  forecastProposal: number | null;
  forecastProposalDemandPlanner: number | null;
  validatedForecast: number | null;
  indicativeDemandPlan: number | null;
  currentDemandPlan: number | null;
  confirmedDeliveriesCombined: number | null;
  confirmedDeliveriesActive: number | null;
  confirmedDeliveriesPredecessor: number | null;
  confirmedFirmBusinessCombined: number | null;
  confirmedFirmBusinessActive: number | null;
  confirmedFirmBusinessPredecessor: number | null;
  confirmedDemandPlan: number | null;
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
  fromDate: string;
} & ResponseWithResultMessage;

export interface SelectedKpis {
  activeAndPredecessor: boolean;
  deliveries: boolean;
  firmBusiness: boolean;
  opportunities: boolean;
  forecastProposal: boolean;
  forecastProposalDemandPlanner: boolean;
  validatedForecast: boolean;
  indicativeDemandPlan: boolean;
  currentDemandPlan: boolean;
  confirmedDeliveries: boolean;
  confirmedFirmBusiness: boolean;
  confirmedDemandPlan: boolean;
}

export interface ForecastInfo {
  customerNumber?: string;
  materialNumber?: string;
  materialDescription?: string;
  packagingSize?: number;
  materialClassification?: string;
  currentRLTSchaeffler?: number;
  currentRLTCustomer?: number;
  productionLine?: string;
  productionSegment?: string;
  productLine?: string;
  language?: string;
  productLineText?: string;
  transitTimeSdcDc?: number;
  transitTimeDcRlp?: number;
  deliveryPlant?: string;
  planningPlant?: string;
  regionalLevelingPoint?: string;
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
