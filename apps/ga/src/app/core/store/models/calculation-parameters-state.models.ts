import { ApplicationScenario } from '@ga/features/grease-calculation/calculation-parameters/constants/application-scenarios.model';
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
    applicationScenario: ApplicationScenario;
  };
  preferredGrease: PreferredGrease;
  automaticLubrication: boolean;
  valid: boolean;
  updating: boolean;
  properties: Property[];
}
