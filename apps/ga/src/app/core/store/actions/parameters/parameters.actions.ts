import { createAction, props } from '@ngrx/store';

import {
  DialogResponse,
  PreferredGreaseOption,
  Property,
} from '@ga/shared/models';

import { ParameterState } from '../../reducers/parameter/parameter.reducer';

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

export const getDialog = createAction('[Parameters] Get Dialog');

export const getDialogSuccess = createAction(
  '[Parameters] Get Dialog Success',
  props<{ dialogResponse: DialogResponse }>()
);

export const getDialogEnd = createAction('[Parameters] Get Dialog End');

export const getDialogFailure = createAction('[Parameters] Get Dialog Failure');

export const setPreferredGreaseSelection = createAction(
  '[Parameters] Set Preferred Grease Selection',
  props<{ selectedGrease: PreferredGreaseOption }>()
);

export const resetPreferredGreaseSelection = createAction(
  '[Parameters] Reset Preferred Grease Selection'
);
