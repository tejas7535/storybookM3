export interface CustomerSalesPlanningData {
  currency: string;
  customerNumber: string;
  customerName: string;
  lastPlannedBy: number;
  lastChangeDate: number;
  firmBusinessPreviousYear: number;
  yearlyTotalCurrentYear: number;
  firmBusinessCurrentYear: number;
  deviationToPreviousYear: number;
  salesPlannedCurrentYear: number;
  demandPlannedCurrentYear: number;
  yearlyTotalNextYear: number;
  firmBusinessNextYear: number;
  deviationToCurrentYear: number;
  salesPlannedNextYear: number;
  demandPlannedNextYear: number;
}
