export interface GcmProcessedEntity {
  deviceId: string;
  timestamp: string;
  gcm01TemperatureOptics: number;
  gcm01TemperatureOpticsMin: number;
  gcm01TemperatureOpticsMax: number;
  gcm01Deterioration: number;
  gcm01DeteriorationMin: number;
  gcm01DeteriorationMax: number;
  gcm01WaterContent: number;
  gcm01WaterContentMin: number;
  gcm01WaterContentMax: number;
  gcm02TemperatureOptics: number;
  gcm02TemperatureOpticsMin: number;
  gcm02TemperatureOpticsMax: number;
  gcm02Deterioration: number;
  gcm02DeteriorationMin: number;
  gcm02DeteriorationMax: number;
  gcm02WaterContent: number;
  gcm02WaterContentMin: number;
  gcm02WaterContentMax: number;
}
