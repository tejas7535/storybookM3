import { createSelector } from '@ngrx/store';

import { getCaseState } from '../../reducers';
import { CaseState } from '../../reducers/create-case/create-case.reducer';

export const getQuotation = createSelector(
  getCaseState,
  (state: CaseState) => state.createCase.quotation
);
export const getCustomer = createSelector(
  getCaseState,
  (state: CaseState) => state.createCase.customer
);
export const getAutocompleteLoading = createSelector(
  getCaseState,
  (state: CaseState): string => state.createCase.autocompleteLoading
);
