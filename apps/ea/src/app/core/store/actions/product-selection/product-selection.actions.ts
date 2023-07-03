import { createAction, props } from '@ngrx/store';

export const setBearingDesignation = createAction(
  '[Product Selection] Set Bearing Designation',
  props<{ bearingDesignation: string }>()
);

export const fetchBearingId = createAction(
  '[Product Selection] Fetch Bearing Id'
);

export const setBearingId = createAction(
  '[Product Selection] Set Bearing Id',
  props<{ bearingId: string }>()
);

export const fetchCalculationModuleInfo = createAction(
  '[Product Selection] Fetch Calculation Module Info'
);

export const setProductFetchFailure = createAction(
  '[Product Selection] Set Product Fetch Failure',
  props<{ error: string }>()
);
