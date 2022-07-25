import {
  EnvironmentImpact,
  LoadLevels,
  LoadTypes,
  Movement,
  SelectedGreases,
} from '.';

export interface CalculationParameters {
  idcO_DESIGNATION: string;
  idlC_TYPE_OF_MOVEMENT: Movement;
  idscO_OILTEMP: string;
  idslC_TEMPERATURE: string;
  idscO_INFLUENCE_OF_AMBIENT: EnvironmentImpact;
  idscO_GREASE_SELECTION_ARCANOL: SelectedGreases;
  idcO_LOAD_INPUT_GREASE_APP: LoadTypes;
  idcO_LOAD_LEVELS?: LoadLevels;
  idcO_RADIAL_LOAD?: string;
  idcO_AXIAL_LOAD?: string;
  idL_RELATIVE_SPEED_WITHOUT_SIGN?: string;
  idlC_OSCILLATION_ANGLE?: string;
  idlC_MOVEMENT_FREQUENCY?: string;
}
