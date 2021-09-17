import { CalculationParamters, Movement } from '../../app/shared/models';

export const BEARING_SEARCH_RESULT_MOCK: string[] = [
  'Bearing Number 1',
  'Bearing Number 2',
  'Bearing Number 69',
];

export const CALCULATION_PARAMETERS_MOCK: CalculationParamters = {
  idcO_DESIGNATION: '6005',
  idlC_TYPE_OF_MOVEMENT: Movement.rotating,
  idL_RELATIVE_SPEED_WITHOUT_SIGN: '1500.0',
  idlC_OSCILLATION_ANGLE: '50.0',
  idlC_MOVEMENT_FREQUENCY: '10.0',
  idcO_RADIAL_LOAD: '1000.0',
  idcO_AXIAL_LOAD: '200.0',
  idscO_OILTEMP: '70.0',
  idslC_TEMPERATURE: '20.0',
  idscO_INFLUENCE_OF_AMBIENT: 'LB_AVERAGE_AMBIENT_INFLUENCE',
};

export const CALCULATION_RESULT_MOCK = 'calculation_id';
