import { createSelector } from '@ngrx/store';

import { getModelId, getSelectedBearing } from '..';
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

export const getCalculationParameters = createSelector(
  getParameterState,
  getSelectedBearing,
  getModelId,
  (
    state: ParameterState,
    bearing: string,
    modelId: string
  ): { modelId: string; options: CalculationParamters } =>
    state &&
    state?.valid &&
    bearing &&
    modelId && {
      modelId,
      options: {
        idcO_DESIGNATION: `${bearing}`,
        idlC_TYPE_OF_MOVEMENT: state.movements.type,
        idL_RELATIVE_SPEED_WITHOUT_SIGN: `${state.movements.rotationalSpeed.toFixed(
          1
        )}`,
        idcO_RADIAL_LOAD: `${(state.loads.radial || 0).toFixed(1)}`,
        idcO_AXIAL_LOAD: `${(state.loads.axial || 0).toFixed(1)}`,
        idscO_OILTEMP: `${state.environment.operatingTemperature.toFixed(1)}`,
        idslC_TEMPERATURE: `${state.environment.environmentTemperature.toFixed(
          1
        )}`,
        idscO_INFLUENCE_OF_AMBIENT: state.environment.environmentImpact,
        // idlC_OSCILLATION_ANGLE: `${state.movements.shiftAngle.toFixed(1)}` ,
        // idlC_MOVEMENT_FREQUENCY: `${state.movements.shiftFrequency.toFixed(1)}`,
      },
    }
);
