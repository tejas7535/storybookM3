export enum Unit {
  percent = '%',
  degree = '°C',
  rotationSpeed = 'rpm',
  load = 'N',
}

export enum Type {
  grease,
  load,
  edm,
  rsm,
}

export interface GreaseControl {
  label: string;
  formControl: string;
  unit: Unit;
  type?: Type;
}
