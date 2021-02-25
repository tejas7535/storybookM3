import {
  GreaseControl,
  Unit,
} from '../../core/store/reducers/grease-status/models';

export const GREASE_DASHBOARD: GreaseControl[] = [
  {
    label: 'waterContent',
    formControl: 'waterContent',
    unit: Unit.percent,
  },
  {
    label: 'deteroration',
    formControl: 'deterioration',
    unit: Unit.percent,
  },
  {
    label: 'temperatureOptics',
    formControl: 'temperatureOptics',
    unit: Unit.degree,
  },
];

export const GREASE_CONTROLS: GreaseControl[] = [
  {
    label: 'waterContent_1',
    formControl: 'waterContent_1',
    unit: Unit.percent,
  },
  {
    label: 'deteroration_1',
    formControl: 'deterioration_1',
    unit: Unit.percent,
  },
  {
    label: 'temperatureOptics_1',
    formControl: 'temperatureOptics_1',
    unit: Unit.degree,
  },
  {
    label: 'waterContent_2',
    formControl: 'waterContent_2',
    unit: Unit.percent,
  },
  {
    label: 'deteroration_2',
    formControl: 'deterioration_2',
    unit: Unit.percent,
  },
  {
    label: 'temperatureOptics_2',
    formControl: 'temperatureOptics_2',
    unit: Unit.degree,
  },
  {
    label: 'rsmShaftSpeed',
    formControl: 'rsmShaftSpeed',
    unit: Unit.rotationSpeed,
  },
];
