export interface Edm {
  [index: number]: EdmMeasurement;
}

export interface EdmMeasurement {
  startDate: string;
  edmValue1Counter: number;
  edmValue2Counter: number;
  edmValue1CounterMax: number;
  edmValue2CounterMax: number;
}
