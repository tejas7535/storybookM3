import { Action, createReducer, on } from '@ngrx/store';

import {
  applyTextSearch,
  applyTextSearchFailure,
  applyTextSearchSuccess,
  autocomplete,
  autocompleteFailure,
  autocompleteSuccess,
  getInitialFilters,
  getInitialFiltersFailure,
  getInitialFiltersSuccess,
  removeFilter,
  resetFilters,
  search,
  searchFailure,
  searchSuccess,
  shareSearchResult,
  updateFilter,
} from '../../actions/search/search.actions';
import { filterItemAdapter, FilterItemState } from './filter-item.entity';

export interface SearchState {
  filters: {
    loading: boolean;
    selected: FilterItemState;
    possible: FilterItemState;
    searchText: {
      field: string;
      value: string;
    };
  };
  referenceTypes: {
    loading: boolean;
    items: any[];
    tooManyResults: boolean;
  };
}

export const initialState: SearchState = {
  filters: {
    loading: false,
    selected: filterItemAdapter.getInitialState(),
    possible: filterItemAdapter.getInitialState(),
    searchText: {
      field: undefined,
      value: undefined,
    },
  },
  referenceTypes: {
    loading: false,
    items: undefined,
    tooManyResults: false,
  },
};

export const searchReducer = createReducer(
  initialState,
  // initial filters
  on(getInitialFilters, (state: SearchState) => ({
    ...state,
    filters: { ...state.filters, loading: true },
  })),
  on(getInitialFiltersSuccess, (state: SearchState, { items }) => ({
    ...state,
    filters: {
      ...state.filters,
      loading: false,
      possible: filterItemAdapter.setAll(items, state.filters.possible),
    },
  })),
  on(getInitialFiltersFailure, (state: SearchState) => ({
    ...state,
    filters: { ...state.filters, loading: false },
  })),

  // search
  on(search, (state: SearchState) => ({
    ...state,
    referenceTypes: {
      ...state.referenceTypes,
      loading: true,
    },
  })),
  on(searchSuccess, (state: SearchState, { searchResult }) => ({
    ...state,
    filters: {
      ...state.filters,
      possible: filterItemAdapter.setAll(
        searchResult.possible,
        state.filters.possible
      ),
    },
    referenceTypes: {
      ...state.referenceTypes,
      items: searchResult.result,
      loading: false,
      tooManyResults: !searchResult.result,
    },
  })),
  on(searchFailure, (state: SearchState) => ({
    ...state,
    referenceTypes: {
      ...state.referenceTypes,
      loading: false,
    },
  })),

  // apply textSearch
  on(applyTextSearch, (state: SearchState) => ({
    ...state,
    referenceTypes: {
      ...state.referenceTypes,
      loading: true,
    },
  })),
  on(applyTextSearchSuccess, (state: SearchState, { searchResult }) => ({
    ...state,
    filters: {
      ...state.filters,
      possible: filterItemAdapter.setAll(
        searchResult.possible,
        state.filters.possible
      ),
    },
    referenceTypes: {
      ...state.referenceTypes,
      items: searchResult.result,
      loading: false,
      tooManyResults: !searchResult.result,
    },
  })),
  on(applyTextSearchFailure, (state: SearchState) => ({
    ...state,
    referenceTypes: {
      ...state.referenceTypes,
      loading: false,
    },
  })),

  // entity changes
  on(updateFilter, (state: SearchState, { item }) => ({
    ...state,
    filters: {
      ...state.filters,
      selected: filterItemAdapter.upsertOne(item, state.filters.selected),
    },
  })),
  on(removeFilter, (state: SearchState, { name }) => ({
    ...state,
    filters: {
      ...state.filters,
      selected: filterItemAdapter.removeOne(name, state.filters.selected),
    },
  })),
  on(resetFilters, (state: SearchState) => ({
    ...state,
    filters: {
      ...state.filters,
      selected: filterItemAdapter.removeAll(state.filters.selected),
    },
  })),

  // additional functionality
  on(shareSearchResult, (state: SearchState) => state),
  on(autocomplete, (state: SearchState) => state),
  on(autocompleteSuccess, (state: SearchState, { item }) => ({
    ...state,
    filters: {
      ...state.filters,
      possible: filterItemAdapter.upsertOne(item, state.filters.possible),
    },
  })),
  on(autocompleteFailure, (state: SearchState) => state)
);

// tslint:disable-next-line: only-arrow-functions
export function reducer(state: SearchState, action: Action): SearchState {
  return searchReducer(state, action);
}
