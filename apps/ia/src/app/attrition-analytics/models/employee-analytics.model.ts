import { EmployeeAnalyticsFeature } from './employee-analytics-feature.model';

export interface EmployeeAnalytics {
  region: string;
  timePeriod: string;
  avgAttritionRate: number;
  features: EmployeeAnalyticsFeature[];
}
