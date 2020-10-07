import { createAction, props, union } from '@ngrx/store';
import { CustomerDetails, QuotationDetails } from '../../models';

export const customerDetailsRequest = createAction(
  '[Case] Get Customer Details',
  props<{ customerNumber: string }>()
);

export const customerDetailsSuccess = createAction(
  '[Case] Get Customer Details Success',
  props<{ customerDetails: CustomerDetails }>()
);

export const customerDetailsFailure = createAction(
  '[Case] Get Customer Details Failure'
);

export const quotationDetailsRequest = createAction(
  '[Case] Get Quotation Details',
  props<{ quotationNumber: string }>()
);

export const quotationDetailsSuccess = createAction(
  '[Case] Get Quotation Details Success',
  props<{ quotationDetails: QuotationDetails[] }>()
);

export const quotationDetailsFailure = createAction(
  '[Case] Get Quotation Details Failure'
);

const all = union({
  customerDetailsRequest,
  customerDetailsFailure,
  customerDetailsSuccess,
  quotationDetailsRequest,
  quotationDetailsFailure,
  quotationDetailsSuccess,
});

export type CaseActions = typeof all;
