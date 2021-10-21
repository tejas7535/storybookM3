import { Control, Type, Unit } from '../models';

export const MAINTENACE_ASSESSMENT_CONTROLS: Control[] = [
  {
    label: 'waterContent_1',
    formControl: 'waterContent_1',
    unit: Unit.percent,
    type: Type.grease,
    color: '#52B796',
  },
  {
    label: 'deterioration_1',
    formControl: 'deterioration_1',
    unit: Unit.percent,
    type: Type.grease,
    color: '#ED407A',
  },
  {
    label: 'temperatureOptics_1',
    formControl: 'temperatureOptics_1',
    unit: Unit.degree,
    type: Type.grease,
    color: '#FF541F',
  },
  {
    label: 'waterContent_2',
    formControl: 'waterContent_2',
    unit: Unit.percent,
    type: Type.grease,
    color: '#678486',
  },
  {
    label: 'deterioration_2',
    formControl: 'deterioration_2',
    unit: Unit.percent,
    type: Type.grease,
    color: '#874A89',
  },
  {
    label: 'temperatureOptics_2',
    formControl: 'temperatureOptics_2',
    unit: Unit.degree,
    type: Type.grease,
    color: '#FD950D',
  },
  {
    label: 'rsmShaftSpeed',
    formControl: 'rsmShaftSpeed',
    unit: Unit.rotationSpeed,
    type: Type.rsm,
    color: '#765B54',
  },
  {
    label: 'edm01Ai01Counter',
    formControl: 'edm01Ai01Counter',
    type: Type.edm,
    color: '#1B9BAD',
  },
  {
    label: 'edm01Ai02Counter',
    formControl: 'edm01Ai02Counter',
    type: Type.edm,
    color: '#2296F0',
  },
];
