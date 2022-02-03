import { createAction, props, union } from '@ngrx/store';

import { SapPriceConditionDetail } from '../../reducers/sap-price-details/models/sap-price-condition-detail.model';

export const loadSapPriceDetails = createAction(
  '[SAP Price Details] Load SAP Price Details for QuotationDetail',
  props<{ gqPositionId: string }>()
);

export const loadSapPriceDetailsSuccess = createAction(
  '[SAP Price Details] Load SAP Price Details for QuotationDetail Success',
  props<{ sapPriceDetails: SapPriceConditionDetail[] }>()
);

export const loadSapPriceDetailsFailure = createAction(
  '[SAP Price Details] Load SAP Price Details for QuotationDetail Failure',
  props<{ errorMessage: string }>()
);

const all = union({
  loadSapPriceDetails,
  loadSapPriceDetailsSuccess,
  loadSapPriceDetailsFailure,
});

export type SapPriceDetailsActions = typeof all;
