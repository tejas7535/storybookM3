import { createAction, props, union } from '@ngrx/store';

import { Property } from '../../../../shared/models/parameters';
import { ParameterState } from './../../reducers/parameter/parameter.reducer';

export const patchParameters = createAction(
  '[Parameters] Patch Parameters',
  props<{ parameters: ParameterState }>()
);

export const modelUpdateSuccess = createAction(
  '[Parameters] Model Update Success'
);

export const getProperties = createAction('[Parameters] Get Properties');

export const getPropertiesSuccess = createAction(
  '[Parameters] Get Properties Success',
  props<{ properties: Property[] }>()
);

export const getPropertiesFailure = createAction(
  '[Parameters] Get Properties Failure'
);

const all = union({
  patchParameters,
  modelUpdateSuccess,
  getProperties,
  getPropertiesSuccess,
  getPropertiesFailure,
});

export type ParametersAction = typeof all;
