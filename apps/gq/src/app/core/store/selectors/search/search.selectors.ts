import { createSelector } from '@ngrx/store';

import { getSearchState } from '../../reducers';
import {
  filterItemAdapter,
  FilterItemState,
} from '../../reducers/search/filter-item.entity';
import { SearchState } from '../../reducers/search/search.reducer';

const { selectAll } = filterItemAdapter.getSelectors();

export const getFiltersEntityState = createSelector(
  getSearchState,
  (state: SearchState): FilterItemState => state.filters.items
);

export const getFilters = createSelector(getFiltersEntityState, selectAll);

export const getAutocompleteLoading = createSelector(
  getSearchState,
  (state: SearchState) => state.filters.autocompleteLoading
);
