import { FeatureImportanceType, FeatureImportanceDataPoint } from './';

export interface FeatureImportanceGroup {
  feature: string;
  type: FeatureImportanceType;
  dataPoints: FeatureImportanceDataPoint[];
}
