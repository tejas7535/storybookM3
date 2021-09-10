import { createSelector } from '@ngrx/store';

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
