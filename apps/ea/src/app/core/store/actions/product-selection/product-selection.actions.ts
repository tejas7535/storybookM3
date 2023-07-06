import { createAction, props } from '@ngrx/store';

import { ProductSelectionState } from '../../models/product-selection-state.model';

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

export const setCalculationModuleInfo = createAction(
  '[Product Selection] Set Calculation Module Info',
  props<{
    calculationModuleInfo: ProductSelectionState['calculationModuleInfo'];
  }>()
);

export const setProductFetchFailure = createAction(
  '[Product Selection] Set Product Fetch Failure',
  props<{ error: string }>()
);
