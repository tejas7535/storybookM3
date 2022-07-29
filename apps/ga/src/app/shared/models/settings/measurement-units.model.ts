export enum MeasurementUnits {
  Metric = 'ID_UNIT_SET_SI',
  Imperial = 'ID_UNIT_SET_FPS',
}

export interface MeasurementUnitsOption {
  id: `${MeasurementUnits}`;
  text: string;
}
