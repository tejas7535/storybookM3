export interface Edm {
  [index: number]: EdmMeasurement;
}

export interface EdmMeasurement {
  edmValue1Counter: number;
  edmValue2Counter: number;
  endDate: string;
  id: number;
  sampleRatio: number;
  sensorId: string;
  startDate: string;
}
