import {
  EnvironmentImpact,
  LoadLevels,
  Movement,
  PreferredGrease,
  Property,
} from '@ga/shared/models';

export interface CalculationParametersState {
  loads: {
    radial: number;
    axial: number;
    exact: boolean;
    loadRatio: LoadLevels;
  };
  movements: {
    type: Movement;
    rotationalSpeed: number;
    shiftFrequency: number;
    shiftAngle: number;
  };
  environment: {
    operatingTemperature: number;
    environmentTemperature: number;
    environmentImpact: EnvironmentImpact;
  };
  preferredGrease: PreferredGrease;
  valid: boolean;
  updating: boolean;
  properties: Property[];
}
