import {
  CalculationParameters,
  EnvironmentImpact,
  LoadTypes,
  Movement,
  SelectedGreases,
} from '@ga/shared/models';

export const CALCULATION_PARAMETERS_MOCK: CalculationParameters = {
  idcO_DESIGNATION: '6005',
  idlC_TYPE_OF_MOVEMENT: Movement.rotating,
  idL_RELATIVE_SPEED_WITHOUT_SIGN: '1500.0',
  idlC_OSCILLATION_ANGLE: '50.0',
  idlC_MOVEMENT_FREQUENCY: '10.0',
  idcO_LOAD_INPUT_GREASE_APP: LoadTypes.LB_ENTER_LOAD,
  idcO_RADIAL_LOAD: '1000.0',
  idcO_AXIAL_LOAD: '200.0',
  idscO_GREASE_SELECTION_ARCANOL: SelectedGreases.no,
  idscO_OILTEMP: '70.0',
  idslC_TEMPERATURE: '20.0',
  idscO_INFLUENCE_OF_AMBIENT: EnvironmentImpact.moderate,
};
