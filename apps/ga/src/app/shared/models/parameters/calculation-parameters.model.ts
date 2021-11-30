import { EnvironmentImpact, Movement } from '.';

export interface CalculationParamters {
  idcO_DESIGNATION: string;
  idlC_TYPE_OF_MOVEMENT: Movement;
  idcO_RADIAL_LOAD: string;
  idcO_AXIAL_LOAD: string;
  idscO_OILTEMP: string;
  idslC_TEMPERATURE: string;
  idscO_INFLUENCE_OF_AMBIENT: EnvironmentImpact;
  idL_RELATIVE_SPEED_WITHOUT_SIGN?: string;
  idlC_OSCILLATION_ANGLE?: string;
  idlC_MOVEMENT_FREQUENCY?: string;
}
