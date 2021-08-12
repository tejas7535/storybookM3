export interface GCMHeatmapEntry {
  timestamp: string;
  gcm01TemperatureOpticsMax: number;
  gcm01TemperatureOpticsClassification: GCMHeatmapClassification;
  gcm01DeteriorationMax: number;
  gcm01DeteriorationClassification: GCMHeatmapClassification;
  gcm01WaterContentMax: number;
  gcm01WaterContentClassification: GCMHeatmapClassification;
  gcm02TemperatureOpticsMax: number;
  gcm02TemperatureOpticsClassification: GCMHeatmapClassification;
  gcm02DeteriorationMax: number;
  gcm02DeteriorationClassification: GCMHeatmapClassification;
  gcm02WaterContentMax: number;
  gcm02WaterContentClassification: GCMHeatmapClassification;
}

export enum GCMHeatmapClassification {
  WARNING = 'Warning',
  OKAY = 'Normal',
  ERROR = 'Error',
}
