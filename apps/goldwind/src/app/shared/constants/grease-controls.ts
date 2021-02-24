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
  {
    label: 'rsmShaftSpeed',
    formControl: 'rsmShaftSpeed',
    unit: Unit.rotationSpeed,
  },
];
