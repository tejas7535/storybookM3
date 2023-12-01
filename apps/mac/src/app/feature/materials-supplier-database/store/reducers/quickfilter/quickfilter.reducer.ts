/* eslint-disable max-lines */
import { Action, createReducer, on } from '@ngrx/store';

import { QuickFilter } from '@mac/feature/materials-supplier-database/models';
import * as QuickFilterActions from '@mac/msd/store/actions/quickfilter/quickfilter.actions';

export interface QuickFilterState {
  localFilters: QuickFilter[];
  publishedFilters: QuickFilter[];
  subscribedFilters: QuickFilter[];
  queriedFilters: QuickFilter[];
  arePublishedFiltersLoading: boolean;
  areSubscribedFiltersLoading: boolean;
  isLoading: boolean;
}

export const initialState: QuickFilterState = {
  localFilters: [],
  publishedFilters: [],
  subscribedFilters: [],
  queriedFilters: [],
  arePublishedFiltersLoading: false,
  areSubscribedFiltersLoading: false,
  isLoading: false,
};

export const quickFilterReducer = createReducer(
  initialState,
  on(
    QuickFilterActions.setLocalQuickFilters,
    (state, { localFilters }): QuickFilterState => ({
      ...state,
      localFilters,
    })
  ),

  on(
    QuickFilterActions.addLocalQuickFilter,
    (state, { localFilter }): QuickFilterState => ({
      ...state,
      localFilters: [...state.localFilters, localFilter],
    })
  ),
  on(
    QuickFilterActions.updateLocalQuickFilter,
    (state, { oldFilter, newFilter }): QuickFilterState => {
      const localFilters = [...state.localFilters];
      const index = localFilters.indexOf(oldFilter);
      localFilters[index] = newFilter;

      return {
        ...state,
        localFilters,
      };
    }
  ),
  on(
    QuickFilterActions.removeLocalQuickFilter,
    (state, { localFilter }): QuickFilterState => ({
      ...state,
      localFilters: state.localFilters.filter((val) => val !== localFilter),
    })
  ),
  on(
    QuickFilterActions.publishQuickFilter,
    (state): QuickFilterState => ({
      ...state,
      isLoading: true,
    })
  ),
  on(
    QuickFilterActions.publishQuickFilterSuccess,
    (state, { publishedQuickFilter }): QuickFilterState => ({
      ...state,
      publishedFilters: [...state.publishedFilters, publishedQuickFilter],
      isLoading: false,
    })
  ),
  on(
    QuickFilterActions.publishQuickFilterFailure,
    (state): QuickFilterState => ({
      ...state,
      isLoading: false,
    })
  ),
  on(
    QuickFilterActions.updatePublicQuickFilter,
    (state): QuickFilterState => ({
      ...state,
      isLoading: true,
    })
  ),
  on(
    QuickFilterActions.updatePublicQuickFilterSuccess,
    (state, { updatedQuickFilter }): QuickFilterState => ({
      ...state,
      publishedFilters: state.publishedFilters.map(
        (publishedFilter: QuickFilter) =>
          publishedFilter.id === updatedQuickFilter.id
            ? updatedQuickFilter
            : publishedFilter
      ),
      isLoading: false,
    })
  ),
  on(
    QuickFilterActions.updatePublicQuickFilterFailure,
    (state): QuickFilterState => ({
      ...state,
      isLoading: false,
    })
  ),
  on(
    QuickFilterActions.fetchPublishedQuickFilters,
    (state): QuickFilterState => ({
      ...state,
      publishedFilters: [],
      arePublishedFiltersLoading: true,
    })
  ),
  on(
    QuickFilterActions.fetchPublishedQuickFiltersSuccess,
    (state, { publishedFilters }): QuickFilterState => ({
      ...state,
      publishedFilters,
      arePublishedFiltersLoading: false,
    })
  ),
  on(
    QuickFilterActions.fetchPublishedQuickFiltersFailure,
    (state): QuickFilterState => ({
      ...state,
      arePublishedFiltersLoading: false,
    })
  ),
  on(
    QuickFilterActions.fetchSubscribedQuickFilters,
    (state): QuickFilterState => ({
      ...state,
      subscribedFilters: [],
      areSubscribedFiltersLoading: true,
    })
  ),
  on(
    QuickFilterActions.fetchSubscribedQuickFiltersSuccess,
    (state, { subscribedFilters }): QuickFilterState => ({
      ...state,
      subscribedFilters,
      areSubscribedFiltersLoading: false,
    })
  ),
  on(
    QuickFilterActions.fetchSubscribedQuickFiltersFailure,
    (state): QuickFilterState => ({
      ...state,
      areSubscribedFiltersLoading: false,
    })
  ),
  on(
    QuickFilterActions.deletePublishedQuickFilter,
    (state): QuickFilterState => ({
      ...state,
      isLoading: true,
    })
  ),
  on(
    QuickFilterActions.deletePublishedQuickFilterSuccess,
    (state, { quickFilterId }): QuickFilterState => ({
      ...state,
      publishedFilters: state.publishedFilters.filter(
        (publishedFilter: QuickFilter) => publishedFilter.id !== quickFilterId
      ),
      isLoading: false,
    })
  ),
  on(
    QuickFilterActions.deletePublishedQuickFilterFailure,
    (state): QuickFilterState => ({
      ...state,
      isLoading: false,
    })
  ),
  on(
    QuickFilterActions.subscribeQuickFilter,
    (state): QuickFilterState => ({
      ...state,
      isLoading: true,
    })
  ),
  on(
    QuickFilterActions.subscribeQuickFilterSuccess,
    (state, { subscribedQuickFilter }): QuickFilterState => ({
      ...state,
      subscribedFilters: sortQuickFiltersByTimestamp([
        ...state.subscribedFilters,
        subscribedQuickFilter,
      ]),
      queriedFilters: state.queriedFilters.filter(
        (queriedFilter: QuickFilter) =>
          queriedFilter.id !== subscribedQuickFilter.id
      ),
      isLoading: false,
    })
  ),
  on(
    QuickFilterActions.subscribeQuickFilterFailure,
    (state): QuickFilterState => ({
      ...state,
      isLoading: false,
    })
  ),
  on(
    QuickFilterActions.unsubscribeQuickFilter,
    (state): QuickFilterState => ({
      ...state,
      isLoading: true,
    })
  ),
  on(
    QuickFilterActions.unsubscribeQuickFilterSuccess,
    (state, { quickFilterId }): QuickFilterState => ({
      ...state,
      subscribedFilters: state.subscribedFilters.filter(
        (subscribedFilter: QuickFilter) => subscribedFilter.id !== quickFilterId
      ),
      isLoading: false,
    })
  ),
  on(
    QuickFilterActions.unsubscribeQuickFilterFailure,
    (state): QuickFilterState => ({
      ...state,
      isLoading: false,
    })
  ),
  on(
    QuickFilterActions.queryQuickFilters,
    (state): QuickFilterState => ({
      ...state,
      queriedFilters: [],
      isLoading: true,
    })
  ),
  on(
    QuickFilterActions.queryQuickFiltersSuccess,
    (state, { queriedFilters }): QuickFilterState => ({
      ...state,
      queriedFilters,
      isLoading: false,
    })
  ),
  on(
    QuickFilterActions.queryQuickFiltersFailure,
    (state): QuickFilterState => ({
      ...state,
      isLoading: false,
    })
  ),
  on(
    QuickFilterActions.resetQueriedQuickFilters,
    (state): QuickFilterState => ({
      ...state,
      queriedFilters: [],
    })
  )
);

export function reducer(
  state: QuickFilterState,
  action: Action
): QuickFilterState {
  return quickFilterReducer(state, action);
}

function sortQuickFiltersByTimestamp(
  quickFilters: QuickFilter[]
): QuickFilter[] {
  return quickFilters.sort(
    (quickFilter1, quickFilter2) =>
      quickFilter1.timestamp - quickFilter2.timestamp
  );
}
