import { createSelector } from '@ngrx/store';

import { ViewQuotation } from '../../models';
import { getViewCasesState } from '../../reducers';
import { ViewCasesState } from '../../reducers/view-cases/view-cases.reducer';

export const getQuotations = createSelector(
  getViewCasesState,
  (state: ViewCasesState): ViewQuotation[] => state.quotations
);
