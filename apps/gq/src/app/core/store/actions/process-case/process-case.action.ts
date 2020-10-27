import { createAction, props, union } from '@ngrx/store';

import { Customer, Quotation, QuotationIdentifier } from '../../models';

export const loadCustomer = createAction('[Process Case] Get Customer Details');

export const loadCustomerSuccess = createAction(
  '[Process Case] Get Customer Details Success',
  props<{ item: Customer }>()
);

export const loadCustomerFailure = createAction(
  '[Process Case] Get Customer Details Failure',
  props<{ errorMessage: string }>()
);

export const loadQuotation = createAction(
  '[Process Case] Get Quotation Details'
);

export const loadQuotationSuccess = createAction(
  '[Process Case] Get Quotation Details Success',
  props<{ item: Quotation }>()
);

export const loadQuotationFailure = createAction(
  '[Process Case] Get Quotation Details Failure',
  props<{ errorMessage: string }>()
);

export const selectQuotation = createAction(
  '[Process Case] Select Quotation',
  props<{ quotationIdentifier: QuotationIdentifier }>()
);

export const createQuotation = createAction(
  '[Process Case] Create Quotation',
  props<{ quotationIdentifier: QuotationIdentifier }>()
);

export const addQuotationDetailToOffer = createAction(
  '[Offer] add QuotationDetail to offer',
  props<{ quotationDetailIDs: string[] }>()
);

export const removeQuotationDetailFromOffer = createAction(
  '[Offer] remove QuotationDetail to offer',
  props<{ quotationDetailIDs: string[] }>()
);

const all = union({
  addQuotationDetailToOffer,
  createQuotation,
  loadCustomer,
  loadCustomerFailure,
  loadCustomerSuccess,
  loadQuotation,
  loadQuotationFailure,
  loadQuotationSuccess,
  removeQuotationDetailFromOffer,
  selectQuotation,
});

export type CaseActions = typeof all;
