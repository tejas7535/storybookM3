import { ParameterState } from '@ga/core/store/reducers/parameter/parameter.reducer';
import { EnvironmentImpact, Movement } from '@ga/shared/models';

export const PARAMETERS_STATE_MOCK: ParameterState = {
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
  },
  preferredGrease: {
    greaseOptions: [],
    selectedGrease: undefined,
    maxTemperature: undefined,
    viscosity: undefined,
    nlgiClass: undefined,
    loading: false,
  },
  valid: false,
  updating: false,
  properties: undefined,
};
