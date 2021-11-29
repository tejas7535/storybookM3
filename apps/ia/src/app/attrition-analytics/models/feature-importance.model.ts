import { FeatureImportanceDataPoint } from '.';

export interface FeatureImportance {
  feature: string;
  type: string;
  data: FeatureImportanceDataPoint[];
}
