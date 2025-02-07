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
  customerNumber: string;
  detailLevel: string;
  planningCurrency: string;
  planningYear: string;
  planningMonth: string;
  planningMaterial: string;
  planningMaterialText: string;
  planningLevelMaterialType: string;
  totalSalesPlanConstrained: number;
  totalSalesPlanUnconstrained: number;
  totalSalesPlanAdjusted: number;
  addOneOriginalValue: number;
  budgetNetSales: number;
  budgetInvoicedSales: number;
  planNetSales: number;
  planInvoiceSales: number;
  firmBusinessCoverage: number;
  firmBusiness: number;
  firmBusinessServices: number;
  opportunitiesDemandRelevant: number;
  opportunitiesDemandRelevantConstrained: number;
  opportunitiesForecastRelevant: number;
  opportunitiesNotSalesPlanRelevant: number;
  plannedValueDemand360: number;
  openPlannedValueDemand360: number;
  apShareConstrained: number;
  apShareUnconstrained: number;
  apShareAdjustedUnconstrained: number;
  apMaterialDemandPlanCount: number;
  spShareUnconstrained: number;
  spShareConstrained: number;
  spShareAdjustedUnconstrained: number;
  spMaterialDemandPlanCount: number;
  opShareUnconstrained: number;
  opShareAdjustedUnconstrained: number;
  opShareConstrained: number;
  opMaterialDemandPlanCount: number;
  salesDeduction: number;
  cashDiscount: number;
  otherRevenues: number;
  dailyRollingSalesPlanUnconstrained: number;
  dailyRollingSalesPlanConstrained: number;
  deliveryBacklog: number;
  orderBookBacklogUnconstrained: number;
  orderBookBacklogConstrained: number;
}
