import { createSelector } from '@ngrx/store';

import { getSelectedBearing } from '..';
import { CalculationParamters } from '../../../../shared/models';
import { getParameterState } from './../../reducers';
import { ParameterState } from './../../reducers/parameter/parameter.reducer';

export const getSelectedMovementType = createSelector(
  getParameterState,
  (state: ParameterState): string => state.movements.type
);

export const getEnvironmentTemperatures = createSelector(
  getParameterState,
  (
    state: ParameterState
  ): { operatingTemperature: number; environmentTemperature: number } => ({
    operatingTemperature: state.environment.operatingTemperature,
    environmentTemperature: state.environment.environmentTemperature,
  })
);

export const getLoadsInputType = createSelector(
  getParameterState,
  (state: ParameterState): boolean => state.loads.exact
);

export const getParameterValidity = createSelector(
  getParameterState,
  (state: ParameterState): boolean => state?.valid
);

export const getCalculationParamters = createSelector(
  getParameterState,
  getSelectedBearing,
  (state: ParameterState, bearing: string): CalculationParamters =>
    state &&
    bearing && {
      idcO_DESIGNATION: `${bearing}`,
      idlC_TYPE_OF_MOVEMENT: state.movements.type,
      idL_RELATIVE_SPEED_WITHOUT_SIGN: `${state.movements.rotationalSpeed}`,
      idlC_OSCILLATION_ANGLE: `${state.movements.shiftAngle}`,
      idlC_MOVEMENT_FREQUENCY: `${state.movements.shiftFrequency}`,
      idcO_RADIAL_LOAD: `${state.loads.radial}`,
      idcO_AXIAL_LOAD: `${state.loads.axial}`,
      idscO_OILTEMP: `${state.environment.operatingTemperature}`,
      idslC_TEMPERATURE: `${state.environment.environmentTemperature}`,
      idscO_INFLUENCE_OF_AMBIENT: `${state.environment.environmentImpact}`,
    }
);
