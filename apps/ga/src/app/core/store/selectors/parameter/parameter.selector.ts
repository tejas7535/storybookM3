import { createSelector } from '@ngrx/store';

import { getParameterState } from './../../reducers';
import { ParameterState } from './../../reducers/parameter/parameter.reducer';

export const getSelectedMovementType = createSelector(
  getParameterState,
  (state: ParameterState): string => state.movements.type
);
