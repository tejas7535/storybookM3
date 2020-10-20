import { createAction, props, union } from '@ngrx/store';
import { Customer, Quotation, QuotationIdentifier } from '../../models';

export const loadCustomer = createAction('[Case] Get Customer Details');

export const loadCustomerSuccess = createAction(
  '[Case] Get Customer Details Success',
  props<{ item: Customer }>()
);

export const loadCustomerFailure = createAction(
  '[Case] Get Customer Details Failure',
  props<{ errorMessage: string }>()
);

export const loadQuotation = createAction('[Case] Get Quotation Details');

export const loadQuotationSuccess = createAction(
  '[Case] Get Quotation Details Success',
  props<{ item: Quotation }>()
);

export const loadQuotationFailure = createAction(
  '[Case] Get Quotation Details Failure',
  props<{ errorMessage: string }>()
);

export const selectQuotation = createAction(
  '[Case] Select Quotation',
  props<{ quotationIdentifier: QuotationIdentifier }>()
);

export const createQuotation = createAction(
  '[Case] Create Quotation',
  props<{ quotationIdentifier: QuotationIdentifier }>()
);

const all = union({
  createQuotation,
  selectQuotation,
  loadCustomer,
  loadCustomerFailure,
  loadCustomerSuccess,
  loadQuotation,
  loadQuotationFailure,
  loadQuotationSuccess,
});

export type CaseActions = typeof all;
