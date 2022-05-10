import { createSelector } from '@ngrx/store';

import { ViewQuotation } from '../../../../case-view/models/view-quotation.model';
import { getViewCasesState } from '../../reducers';
import { ViewCasesState } from '../../reducers/view-cases/view-cases.reducer';

export const getQuotations = createSelector(
  getViewCasesState,
  (state: ViewCasesState): ViewQuotation[] => state.quotations
);

export const getQuotationsLoading = createSelector(
  getViewCasesState,
  (state: ViewCasesState): boolean => state.quotationsLoading
);

export const getDeleteLoading = createSelector(
  getViewCasesState,
  (state: ViewCasesState): boolean => state.deleteLoading
);

export const getSelectedCaseIds = createSelector(
  getViewCasesState,
  (state: ViewCasesState): number[] => state?.selectedCases
);
