import { CalculationParametersState } from '@ga/core/store/models';
import { ApplicationScenario } from '@ga/features/grease-calculation/calculation-parameters/constants/application-scenarios.model';
import { EnvironmentImpact, Movement } from '@ga/shared/models';

export const CALCULATION_PARAMETERS_STATE_MOCK: CalculationParametersState = {
  loads: {
    radial: undefined,
    axial: undefined,
    exact: false,
    loadRatio: undefined,
  },
  movements: {
    type: Movement.rotating,
    rotationalSpeed: undefined,
    shiftFrequency: undefined,
    shiftAngle: undefined,
  },
  environment: {
    operatingTemperature: 70,
    environmentTemperature: 20,
    environmentImpact: EnvironmentImpact.moderate,
    applicationScenario: ApplicationScenario.CleanRoomApplications,
  },
  preferredGrease: {
    greaseOptions: [],
    selectedGrease: undefined,
    maxTemperature: undefined,
    viscosity: undefined,
    nlgiClass: undefined,
    loading: false,
  },
  automaticLubrication: true,
  valid: false,
  updating: false,
  properties: undefined,
};
