export enum Unit {
  percent = '%',
  degree = '°C',
  rotationSpeed = 'rpm',
  load = 'kN',
}

export enum Type {
  grease,
  load,
  edm,
  rsm,
  centerload,
}

export interface Control {
  color?: string;
  label: string;
  formControl: string;
  unit?: Unit;
  type?: Type;
}
