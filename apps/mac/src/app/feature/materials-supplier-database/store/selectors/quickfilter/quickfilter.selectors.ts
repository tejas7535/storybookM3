import { createSelector } from '@ngrx/store';

import * as fromStore from '@mac/msd/store/reducers';

export const getQuickFilterState = createSelector(
  fromStore.getMSDState,
  (msdState) => msdState.quickfilter
);

export const getQuickFilter = createSelector(
  getQuickFilterState,
  (qfState) => qfState.customFilters
);
