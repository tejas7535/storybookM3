import { createAction, props, union } from '@ngrx/store';

import { MaterialDetails } from '../../models';

export const loadMaterialInformation = createAction(
  '[Detail Case] Load Material Information from Endpoint',
  props<{ materialNumber15: string }>()
);
export const loadMaterialInformationFailure = createAction(
  '[Detail Case] Load Material Information from Endpoint Failure'
);
export const loadMaterialInformationSuccess = createAction(
  '[Detail Case] Load Material Information from Endpoint Success',
  props<{ materialDetails: MaterialDetails }>()
);

const all = union({
  loadMaterialInformation,
});

export type detailCaseActions = typeof all;
