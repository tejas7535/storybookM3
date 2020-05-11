import { createSelector } from '@ngrx/store';

import { getSearchState } from '../../reducers';
import { filterItemAdapter } from '../../reducers/search/filter-item.entity';
import { SearchState } from '../../reducers/search/search.reducer';

export const getInitialFiltersLoading = createSelector(
  getSearchState,
  (state: SearchState) => {
    return state.filters.loading;
  }
);

const { selectAll } = filterItemAdapter.getSelectors();

const getSelectedFiltersEntityState = createSelector(
  getSearchState,
  (state: SearchState) => {
    return state.filters.selected;
  }
);

const getPossibleFiltersEntityState = createSelector(
  getSearchState,
  (state: SearchState) => {
    return state.filters.possible;
  }
);

export const getSelectedFilters = createSelector(
  getSelectedFiltersEntityState,
  selectAll
);

export const getPossibleFilters = createSelector(
  getPossibleFiltersEntityState,
  selectAll
);

export const getSearchText = createSelector(
  getSearchState,
  (state: SearchState) => {
    return state.filters.searchText;
  }
);

export const getReferenceTypes = createSelector(
  getSearchState,
  (state: SearchState) => {
    return state.referenceTypes.items;
  }
);

export const getReferenceTypesLoading = createSelector(
  getSearchState,
  (state: SearchState) => {
    return state.referenceTypes.loading;
  }
);

export const getTooManyResults = createSelector(
  getSearchState,
  (state: SearchState) => {
    return state.referenceTypes.tooManyResults;
  }
);

export const getSearchSuccessful = createSelector(
  getSearchState,
  (state: SearchState) => {
    return (
      !state.referenceTypes.tooManyResults &&
      state.referenceTypes.items?.length >= 0
    );
  }
);
