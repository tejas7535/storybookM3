import { createAction, props, union } from '@ngrx/store';

import { MaterialComparableCost } from '../../../../shared/models/quotation-detail/material-comparable-cost.model';

export const loadMaterialComparableCosts = createAction(
  '[Detail View] Load material comparable costs for Quotation Detail',
  props<{ gqPositionId: string }>()
);

export const loadMaterialComparableCostsSuccess = createAction(
  '[Detail View] Load material comparable costs for Quotation Detail Success',
  props<{ materialComparableCosts: MaterialComparableCost[] }>()
);

export const loadMaterialComparableCostsFailure = createAction(
  '[Detail View] Load material comparable costs for Quotation Detail Failure',
  props<{ errorMessage: string }>()
);

const all = union({
  loadMaterialComparableCosts,
  loadMaterialComparableCostsSuccess,
  loadMaterialComparableCostsFailure,
});

export type MaterialComparableCostsActions = typeof all;
