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
