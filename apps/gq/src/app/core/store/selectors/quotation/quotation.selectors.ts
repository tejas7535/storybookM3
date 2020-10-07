import { createSelector } from '@ngrx/store';

import { CustomerDetails, QuotationDetails } from '../../models';
import { getQuotationState } from '../../reducers';
import { QuotationState } from '../../reducers/quotation/quotation.reducers';

export const getCustomer = createSelector(
  getQuotationState,
  (state: QuotationState): CustomerDetails => state.customer.item
);

export const getCustomerLoading = createSelector(
  getQuotationState,
  (state: QuotationState): boolean => state.customer.customerDetailsLoading
);

export const getQuotation = createSelector(
  getQuotationState,
  (state: QuotationState): QuotationDetails[] => state.quotation.items
);

export const getQuotationLoading = createSelector(
  getQuotationState,
  (state: QuotationState): boolean => state.quotation.quotationDetailsLoading
);
