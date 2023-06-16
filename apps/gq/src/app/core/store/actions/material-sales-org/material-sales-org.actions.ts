import { MaterialSalesOrg } from '@gq/shared/models/quotation-detail/material-sales-org.model';
import { createAction, props, union } from '@ngrx/store';

export const loadMaterialSalesOrg = createAction(
  '[Detail View] Load Material Data For SalesOrg For Quotation Detail',
  props<{ gqPositionId: string }>()
);

export const loadMaterialSalesOrgSuccess = createAction(
  '[Detail View] Load Material Data For SalesOrgs For Quotation Detail Success',
  props<{ materialSalesOrg: MaterialSalesOrg }>()
);

export const loadMaterialSalesOrgFailure = createAction(
  '[Detail View] Load Material Data For SalesOrgs For Quotation Detail Failure',
  props<{ errorMessage: string }>()
);

const all = union({
  loadMaterialSalesOrg,
  loadMaterialSalesOrgSuccess,
  loadMaterialSalesOrgFailure,
});

export type MaterialSalesOrgActions = typeof all;
