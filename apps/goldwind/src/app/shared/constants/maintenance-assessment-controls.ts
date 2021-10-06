import { Control, Type, Unit } from '../models';

export const MAINTENACE_ASSESSMENT_CONTROLS: Control[] = [
  {
    label: 'waterContent_1',
    formControl: 'waterContent_1',
    unit: Unit.percent,
    type: Type.grease,
    color: '#1D9BB2',
  },
  {
    label: 'deterioration_1',
    formControl: 'deterioration_1',
    unit: Unit.percent,
    type: Type.grease,
    color: '#854B85',
  },
  {
    label: 'temperatureOptics_1',
    formControl: 'temperatureOptics_1',
    unit: Unit.degree,
    type: Type.grease,
    color: '#FF9800',
  },
  {
    label: 'waterContent_2',
    formControl: 'waterContent_2',
    unit: Unit.percent,
    type: Type.grease,
    color: '#EC407A',
  },
  {
    label: 'deterioration_2',
    formControl: 'deterioration_2',
    unit: Unit.percent,
    type: Type.grease,
    color: '#6A8186',
  },
  {
    label: 'temperatureOptics_2',
    formControl: 'temperatureOptics_2',
    unit: Unit.degree,
    type: Type.grease,
    color: '#56B496',
  },
  {
    label: 'rsmShaftSpeed',
    formControl: 'rsmShaftSpeed',
    unit: Unit.rotationSpeed,
    type: Type.rsm,
    color: '#FF5722',
  },
  {
    label: 'edm01Ai01Counter',
    formControl: 'edm01Ai01Counter',
    unit: Unit.percent,
    type: Type.edm,
    color: '#795548',
  },
  {
    label: 'edm01Ai02Counter',
    formControl: 'edm01Ai02Counter',
    unit: Unit.percent,
    type: Type.edm,
    color: '#2196F3',
  },
];
