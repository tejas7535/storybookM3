import { createSelector } from '@ngrx/store';

import { IdValue } from '../../models';
import { getCaseState } from '../../reducers';
import { CaseState } from '../../reducers/create-case/create-case.reducer';

export const getCaseQuotationOptions = createSelector(
  getCaseState,
  (state: CaseState): IdValue[] => {
    return state.createCase.quotation.options;
  }
);
export const getCaseCustomer = createSelector(
  getCaseState,
  (state: CaseState) => state.createCase.customer
);
export const getCaseAutocompleteLoading = createSelector(
  getCaseState,
  (state: CaseState): string => state.createCase.autocompleteLoading
);
