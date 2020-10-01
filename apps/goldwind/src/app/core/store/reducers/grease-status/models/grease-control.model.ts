export enum Unit {
  percent = '%',
  degree = '°C',
}

export interface GreaseControl {
  label: string;
  formControl: string;
  unit: Unit;
}
