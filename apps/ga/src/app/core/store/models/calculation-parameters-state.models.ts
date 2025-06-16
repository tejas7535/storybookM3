import { ApplicationScenario } from '@ga/features/grease-calculation/calculation-parameters/constants/application-scenarios.model';
import {
  EnvironmentImpact,
  LoadLevels,
  Movement,
  PreferredGrease,
  Property,
} from '@ga/shared/models';
import { AxisOrientation } from '@ga/shared/models/calculation-parameters/axis-orientation.model';
import { Grease } from '@ga/shared/services/greases/greases.service';

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
    axisOrientation?: AxisOrientation;
  };
  environment: {
    operatingTemperature: number;
    environmentTemperature: number;
    environmentImpact: EnvironmentImpact;
    applicationScenario: ApplicationScenario;
  };
  preferredGrease: PreferredGrease;
  competitorsGreases: Grease[];
  schaefflerGreases: Grease[];
  automaticLubrication: boolean;
  valid: boolean;
  updating: boolean;
  properties: Property[];
}
