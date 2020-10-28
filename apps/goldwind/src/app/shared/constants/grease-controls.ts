import {
  GreaseControl,
  Unit,
} from '../../core/store/reducers/grease-status/models';

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
  // {
  //   label: 'greaseTemperatur',
  //   formControl: 'temperatureCelsius',
  //   unit: Unit.degree,
  // },
  // will be activated later on
  // {
  //   label: 'rotationalSpeed',
  //   formControl: 'rotationalSpeed',
  //   unit: Unit.percent,
  // },
];
