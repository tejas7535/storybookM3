export interface GreaseStatus {
  [index: number]: GreaseStatusMeasurement;
}

export interface GreaseStatusMeasurement {
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
