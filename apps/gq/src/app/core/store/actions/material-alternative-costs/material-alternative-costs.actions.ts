import { createAction, props, union } from '@ngrx/store';
import { MaterialAlternativeCost } from '../../../../shared/models/quotation-detail/material-alternative-cost.model';

export const loadMaterialAlternativeCosts = createAction(
  '[Detail View] Load material alternative costs for Quotation Detail',
  props<{ gqPositionId: string }>()
);

export const loadMaterialAlternativeCostsSuccess = createAction(
  '[Detail View] Load material alternative costs for  Quotation Detail Success',
  props<{ materialAlternativeCosts: MaterialAlternativeCost[] }>()
);

export const loadMaterialAlternativeCostsFailure = createAction(
  '[Detail View] Load material alternative costs for Quotation Detail Failure',
  props<{ errorMessage: string }>()
);

const all = union({
  loadMaterialAlternativeCosts,
  loadMaterialAlternativeCostsSuccess,
  loadMaterialAlternativeCostsFailure,
});

export type MaterialAlternativeCostsActions = typeof all;
