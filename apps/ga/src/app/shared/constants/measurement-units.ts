import { MeasurementUnits, MeasurementUnitsOption } from '@ga/shared/models';

export const measurementUnitsDefault: `${MeasurementUnits}` =
  MeasurementUnits.Metric;

export const measurementUnitsOptions: MeasurementUnitsOption[] = [
  {
    id: MeasurementUnits.Metric,
    text: 'userSettings.measurementUnits.options.metric',
  },
  {
    id: MeasurementUnits.Imperial,
    text: 'userSettings.measurementUnits.options.imperial',
  },
];
