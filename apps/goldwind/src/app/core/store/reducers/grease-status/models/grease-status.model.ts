export interface GreaseStatus {
  deteriorationPercent: number;
  endDate: string;
  id: number;
  isAlarm: boolean;
  sampleRatio: number;
  sensorId: string;
  startDate: string;
  temperatureCelsius: number;
  waterContentPercent: number;
}
