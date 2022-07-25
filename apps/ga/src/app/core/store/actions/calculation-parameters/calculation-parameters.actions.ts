import { createAction, props } from '@ngrx/store';

import { CalculationParametersState } from '@ga/core/store/models';
import {
  DialogResponse,
  PreferredGreaseOption,
  Property,
} from '@ga/shared/models';

export const patchParameters = createAction(
  '[Calculation Parameters] Patch Parameters',
  props<{ parameters: CalculationParametersState }>()
);

export const modelUpdateSuccess = createAction(
  '[Calculation Parameters] Model Update Success'
);

export const getProperties = createAction(
  '[Calculation Parameters] Get Properties'
);

export const getPropertiesSuccess = createAction(
  '[Calculation Parameters] Get Properties Success',
  props<{ properties: Property[] }>()
);

export const getPropertiesFailure = createAction(
  '[Calculation Parameters] Get Properties Failure'
);

export const getDialog = createAction('[Calculation Parameters] Get Dialog');

export const getDialogSuccess = createAction(
  '[Calculation Parameters] Get Dialog Success',
  props<{ dialogResponse: DialogResponse }>()
);

export const getDialogEnd = createAction(
  '[Calculation Parameters] Get Dialog End'
);

export const getDialogFailure = createAction(
  '[Calculation Parameters] Get Dialog Failure'
);

export const setPreferredGreaseSelection = createAction(
  '[Calculation Parameters] Set Preferred Grease Selection',
  props<{ selectedGrease: PreferredGreaseOption }>()
);

export const resetPreferredGreaseSelection = createAction(
  '[Calculation Parameters] Reset Preferred Grease Selection'
);
