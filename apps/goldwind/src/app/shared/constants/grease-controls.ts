import { Control, Unit } from '../models';

export const GREASE_DASHBOARD: Control[] = [
  {
    label: 'waterContent',
    formControl: 'waterContent',
    unit: Unit.percent,
  },
  {
    label: 'deterioration',
    formControl: 'deterioration',
    unit: Unit.percent,
  },
  {
    label: 'temperatureOptics',
    formControl: 'temperatureOptics',
    unit: Unit.degree,
  },
];
