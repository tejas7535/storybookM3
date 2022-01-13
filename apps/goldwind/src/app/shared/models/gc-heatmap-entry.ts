export interface GCMHeatmapEntry {
  timestamp: string;
  gcm01TemperatureOpticsMax: number;
  gcm01TemperatureOpticsMaxClassification: GCMHeatmapClassification;
  gcm01DeteriorationMax: number;
  gcm01DeteriorationMaxClassification: GCMHeatmapClassification;
  gcm01WaterContentMax: number;
  gcm01WaterContentMaxClassification: GCMHeatmapClassification;
  gcm02TemperatureOpticsMax: number;
  gcm02TemperatureOpticsMaxClassification: GCMHeatmapClassification;
  gcm02DeteriorationMax: number;
  gcm02DeteriorationMaxClassification: GCMHeatmapClassification;
  gcm02WaterContentMax: number;
  gcm02WaterContentMaxClassification: GCMHeatmapClassification;
}

export enum GCMHeatmapClassification {
  WARNING = 'Warning',
  OKAY = 'Normal',
  ERROR = 'Critical',
  EMPTY = 'Empty',
}
