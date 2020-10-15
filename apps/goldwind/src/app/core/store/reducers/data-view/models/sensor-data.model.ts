export interface SensorData {
  type?: string;
  description: string;
  abreviation: string;
  designValue?: number;
  actualValue: number;
  minValue: number;
  maxValue: number;
  notification?: string;
}
