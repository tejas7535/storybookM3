import { Control, Type, Unit } from '../models';

export const MAINTENACE_ASSESSMENT_CONTROLS: Control[] = [
  {
    label: 'waterContent_1',
    formControl: 'waterContent_1',
    unit: Unit.percent,
    type: Type.grease,
  },
  {
    label: 'deterioration_1',
    formControl: 'deterioration_1',
    unit: Unit.percent,
    type: Type.grease,
  },
  {
    label: 'temperatureOptics_1',
    formControl: 'temperatureOptics_1',
    unit: Unit.degree,
    type: Type.grease,
  },
  {
    label: 'waterContent_2',
    formControl: 'waterContent_2',
    unit: Unit.percent,
    type: Type.grease,
  },
  {
    label: 'deterioration_2',
    formControl: 'deterioration_2',
    unit: Unit.percent,
    type: Type.grease,
  },
  {
    label: 'temperatureOptics_2',
    formControl: 'temperatureOptics_2',
    unit: Unit.degree,
    type: Type.grease,
  },
  {
    label: 'rsmShaftSpeed',
    formControl: 'rsmShaftSpeed',
    unit: Unit.rotationSpeed,
    type: Type.rsm,
  },
];
