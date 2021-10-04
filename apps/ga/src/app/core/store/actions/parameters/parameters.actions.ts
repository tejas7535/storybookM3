import { createAction, props, union } from '@ngrx/store';

import { ParameterState } from './../../reducers/parameter/parameter.reducer';

export const patchParameters = createAction(
  '[Parameters] Patch Parameters',
  props<{ parameters: ParameterState }>()
);

export const modelUpdateSuccess = createAction(
  '[Parameters] Model Update Success'
);

const all = union({
  patchParameters,
});

export type ParametersAction = typeof all;
