export interface GreaseStatus {
  [index: number]: {
    deteriorationPercent: number;
    endDate: string;
    id: number;
    isAlarm: boolean;
    sampleRatio: number;
    sensorId: string;
    startDate: string;
    temperatureCelsius: number;
    waterContentPercent: number;
  };
}
