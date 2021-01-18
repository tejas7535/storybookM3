export interface GreaseStatus {
  deviceId: string;
  gcm01TemperatureOptics: number;
  gcm01TemperatureOpticsMax: number;
  gcm01TemperatureOpticsMin: number;
  gcm01Deterioration: number;
  gcm01DeteriorationMax: number;
  gcm01DeteriorationMin: number;
  gcm01WaterContent: number;
  gcm01WaterContentMax: number;
  gcm01WaterContentMin: number;
  gcm02TemperatureOptics: number;
  gcm02TemperatureOpticsMax: number;
  gcm02TemperatureOpticsMin: number;
  gcm02Deterioration: number;
  gcm02DeteriorationMax: number;
  gcm02DeteriorationMin: number;
  gcm02WaterContent: number;
  gcm02WaterContentMax: number;
  gcm02WaterContentMin: number;
  timestamp: string;
}
