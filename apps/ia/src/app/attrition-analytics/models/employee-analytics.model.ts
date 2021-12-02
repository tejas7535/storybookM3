export interface EmployeeAnalytics {
  region: string;
  feature: string;
  year: number;
  month: number;
  overallAttritionRate: number;
  values: string[];
  attritionCount: number[];
  employeeCount: number[];
}
