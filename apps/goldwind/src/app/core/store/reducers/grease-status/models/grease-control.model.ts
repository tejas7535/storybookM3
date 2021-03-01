export enum Unit {
  percent = '%',
  degree = '°C',
  rotationSpeed = 'rpm',
}

export interface GreaseControl {
  label: string;
  formControl: string;
  unit: Unit;
}
