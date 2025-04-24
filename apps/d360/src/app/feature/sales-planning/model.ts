export interface SalesPlanResponse {
  customerNumber: string;
  planningCurrency: string;
  invoiceSalesPreviousYear: number;
  invoiceSalesTwoYearsAgo: number;
  unconstrainedPlanThisYear: number;
  constrainedPlanThisYear: number;
  constrainedPlanNextYear: number;
  unconstrainedPlanNextYear: number;
  constrainedPlanTwoYearsFromNow: number;
  unconstrainedPlanTwoYearsFromNow: number;
  constrainedPlanThreeYearsFromNow: number;
  unconstrainedPlanThreeYearsFromNow: number;
}

export interface SalesPlan {
  year: number;
  unconstrained: number | null;
  constrained: number;
}

export interface CustomerInfo {
  globalCustomerNumber: string;
  region: string;
  salesOrg: string;
  salesDescription: string;
  salesArea: string;
  countryCode: string;
  countryDescription: string;
  sector: string;
  sectorDescription: string;
  keyAccountNumber: string;
  keyAccountName: string;
  subKeyAccountNumber: string;
  subKeyAccountName: string;
  planningCurrency: string;
  accountOwner: string;
  internalSales: string;
  demandPlanner: string;
  gkam: string;
  kam: string;
}

export interface PlanningLevelMaterial {
  customerNumber: string;
  planningLevelMaterialType: string;
  isDefaultPlanningLevelMaterialType: boolean;
}

export interface DetailedCustomerSalesPlan {
  addOneOriginalValue: number;
  apMaterialDemandPlanCount: number;
  apShareAdjustedUnconstrained: number;
  apShareConstrained: number;
  apShareOriginalUnconstrained: number;
  apShareUnconstrained: number;
  budgetInvoicedSales: number;
  budgetNetSales: number;
  cashDiscount: number;
  customerNumber: string;
  deliveriesAcrossYears: number;
  detailLevel: string;
  editStatus: string;
  firmBusiness: number;
  firmBusinessCoverage: number;
  firmBusinessServices: number;
  infoIcon: string;
  openPlannedValueDemand360: number;
  opMaterialDemandPlanCount: number;
  opportunitiesDemandRelevant: number;
  opportunitiesDemandRelevantConstrained: number;
  opportunitiesForecastRelevant: number;
  opportunitiesNotSalesPlanRelevant: number;
  opportunitiesTotal: number;
  opShareAdjustedUnconstrained: number;
  opShareConstrained: number;
  opShareOriginalUnconstrained: number;
  opShareUnconstrained: number;
  ordersAcrossYearsFuture: number;
  ordersAcrossYearsPast: number;
  otherRevenues: number;
  planInvoiceSales: number;
  plannedValueDemand360: number;
  planNetSales: number;
  planningCurrency: string;
  planningLevelMaterialType: string;
  planningMaterial: string;
  planningMaterialText: string;
  planningMonth: string;
  planningYear: string;
  salesDeduction: number;
  salesPlanConstrained: number;
  salesPlanUnconstrained: number;
  spMaterialDemandPlanCount: number;
  spShareAdjustedUnconstrained: number;
  spShareConstrained: number;
  spShareOriginalUnconstrained: number;
  spShareUnconstrained: number;
  totalSalesPlanAdjusted: number;
  totalSalesPlanConstrained: number;
  totalSalesPlanUnconstrained: number;
}

export interface DetailedSalesPlanUpdateRequest {
  planningYear: string;
  planningMonth: string;
  planningMaterial: string;
  planningCurrency: string;
  planningLevelMaterialType: string;
  adjustedValue: number;
}

export enum SalesPlanningDetailLevel {
  YearlyAndPlanningLevelMaterialDetailLevel = '2',
  MonthlyOnlyDetailLevel = '3',
  MonthlyAndPlanningLevelMaterialDetailLevel = '4',
}

export interface DetailedCustomerSalesPlanRequest {
  customerNumber: string;
  planningCurrency: string;
  planningMaterial?: string;
  planningLevelMaterialType?: string;
  detailLevel?: string;
  planningYear?: string;
}

export interface ChangeHistoryData {
  changedByUserName: string;
  customerNumber: string;
  planningYear: string;
  planningMonth: string;
  planningMaterial: string;
  changeTimestamp: string;
  changedByUserId: string;
  valueOld: number;
  oldValueCurrency: string;
  valueNew: number;
  newValueCurrency: string;
  changeType: string;
  materialTypeLevel: string;
  materialDescription: string;
}
