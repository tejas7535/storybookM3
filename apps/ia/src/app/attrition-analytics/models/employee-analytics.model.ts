export interface EmployeeAnalytics {
  feature: string;
  overallFluctuationRate: number;
  values: string[];
  names: string[];
  headcount: number[];
  fluctuation: number[];
  order: number[];
  totalEmployees: {
    headcount: number;
    leavers: number;
  };
  notApplicableEmployees: {
    headcount: number;
    leavers: number;
  };
}
