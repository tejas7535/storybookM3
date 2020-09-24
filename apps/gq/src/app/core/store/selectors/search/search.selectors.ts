import { createSelector } from '@ngrx/store';

import { FilterItem } from '../../models';
import { getSearchState } from '../../reducers';
import { SearchState } from '../../reducers/search/search.reducer';

export const getFilters = createSelector(
  getSearchState,
  (state: SearchState): FilterItem[] => state.filters.items
);

export const getSelectedFilter = createSelector(
  getSearchState,
  (state: SearchState): FilterItem =>
    state.filters.items.find((item) => item.filter === state.filters.selected)
);

export const getAutocompleteLoading = createSelector(
  getSearchState,
  (state: SearchState): string => state.filters.autocompleteLoading
);

export const getFilterQueryInputs = createSelector(
  getSearchState,
  (state: SearchState): string[] => state.filters.queryInputs
);

export const getOptionalFilters = createSelector(
  getSearchState,
  getSelectedFilter,
  (state: SearchState, selectedFilter: FilterItem): FilterItem[] =>
    state.filters.items.filter((item) =>
      item.optionalParents.includes(selectedFilter.filter)
    )
);

export const getMaterialNumberAndQuantity = createSelector(
  getSearchState,
  (state: SearchState): FilterItem[] =>
    state.filters.items.filter(
      (item) => item.filter === 'materialNumber' || item.filter === 'quantity'
    )
);
