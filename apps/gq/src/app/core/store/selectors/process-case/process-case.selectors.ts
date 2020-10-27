import { createSelector } from '@ngrx/store';

import {
  Customer,
  Quotation,
  QuotationDetail,
  QuotationIdentifier,
  QuotationInfoEnum,
} from '../../models';
import { getProcessCaseState } from '../../reducers';
import { ProcessCaseState } from '../../reducers/process-case/process-case.reducers';

export const getCustomer = createSelector(
  getProcessCaseState,
  (state: ProcessCaseState): Customer => state.customer.item
);

export const getCustomerLoading = createSelector(
  getProcessCaseState,
  (state: ProcessCaseState): boolean => state.customer.customerLoading
);

export const getQuotation = createSelector(
  getProcessCaseState,
  (state: ProcessCaseState): Quotation => state.quotation.item
);

export const getQuotationLoading = createSelector(
  getProcessCaseState,
  (state: ProcessCaseState): boolean => state.quotation.quotationLoading
);

export const getSelectedQuotationIdentifier = createSelector(
  getProcessCaseState,
  (state: ProcessCaseState): QuotationIdentifier => state.quotationIdentifier
);

export const getOffer = createSelector(
  getProcessCaseState,
  (state: ProcessCaseState): QuotationDetail[] =>
    state.quotation.item === undefined
      ? []
      : state.quotation.item.quotationDetails.filter(
          (quotationDetail) =>
            quotationDetail.info === QuotationInfoEnum.AddedToOffer
        )
);
