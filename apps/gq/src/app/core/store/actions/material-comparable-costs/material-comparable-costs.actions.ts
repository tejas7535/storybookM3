import { MaterialComparableCost } from '@gq/shared/models/quotation-detail/material-comparable-cost.model';
import { createAction, props, union } from '@ngrx/store';

export const loadMaterialComparableCosts = createAction(
  '[Material Comparable Costs] Load Material Comparable Costs For Quotation Detail',
  props<{ gqPositionId: string }>()
);

export const loadMaterialComparableCostsSuccess = createAction(
  '[Material Comparable Costs] Load Material Comparable Costs For Quotation Detail Success',
  props<{ materialComparableCosts: MaterialComparableCost[] }>()
);

export const loadMaterialComparableCostsFailure = createAction(
  '[Material Comparable Costs] Load Material Comparable Costs For Quotation Detail Failure',
  props<{ errorMessage: string }>()
);

const all = union({
  loadMaterialComparableCosts,
  loadMaterialComparableCostsSuccess,
  loadMaterialComparableCostsFailure,
});

export type MaterialComparableCostsActions = typeof all;
