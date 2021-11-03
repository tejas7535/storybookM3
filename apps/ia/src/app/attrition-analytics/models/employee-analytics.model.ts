export interface EmployeeAnalytics {
  region: string;
  feature: string;
  year: number;
  month: number;
  avgAttritionRate: number;
  values: string[];
  attritionCount: number[];
  employeeCount: number[];
}
