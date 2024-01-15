import { createSelector } from '@ngrx/store';

import * as fromStore from '@mac/msd/store/reducers';

export const getQuickFilterState = createSelector(
  fromStore.getMSDState,
  (msdState) => msdState.quickfilter
);

export const getLocalQuickFilters = createSelector(
  getQuickFilterState,
  (qfState) => qfState.localFilters
);

export const getPublishedQuickFilters = createSelector(
  getQuickFilterState,
  (qfState) => qfState.publishedFilters
);

export const getOwnQuickFilters = createSelector(
  getQuickFilterState,
  (qfState) => [...qfState.localFilters, ...qfState.publishedFilters]
);

export const getSubscribedQuickFilters = createSelector(
  getQuickFilterState,
  (qfState) => qfState.subscribedFilters
);

export const getQueriedQuickFilters = createSelector(
  getQuickFilterState,
  (qfState) => qfState.queriedFilters
);

export const isLoading = createSelector(
  getQuickFilterState,
  (qfState) =>
    qfState.arePublishedFiltersLoading ||
    qfState.areSubscribedFiltersLoading ||
    qfState.isLoading
);
