import { FeatureImportanceDataPoint, FeatureImportanceType } from './';

export interface FeatureImportanceGroup {
  feature: string;
  type: FeatureImportanceType;
  dataPoints: FeatureImportanceDataPoint[];
}
