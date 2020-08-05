import { Action, createReducer, on } from '@ngrx/store';

import {
  applyTextSearch,
  applyTextSearchFailure,
  applyTextSearchSuccess,
  autocomplete,
  autocompleteFailure,
  autocompleteSuccess,
  loadInitialFilters,
  loadInitialFiltersFailure,
  loadInitialFiltersSuccess,
  resetFilters,
  search,
  searchFailure,
  searchSuccess,
  shareSearchResult,
  updateFilter,
} from '../../actions/search/search.actions';
import {
  filterItemAdapter,
  FilterItemState,
  resetFilterItems,
} from './filter-item.entity';
import { FilterItem, FilterItemIdValue, FilterItemType } from './models';

export interface SearchState {
  filters: {
    dirty: boolean;
    loading: boolean;
    autocompleteLoading: boolean;
    items: FilterItemState;
    searchText: {
      field: string;
      value: string;
    };
    errorMessage: string;
  };
  referenceTypes: {
    loading: boolean;
    items: any[];
    tooManyResults: boolean;
    resultCount: number;
    errorMessage: string;
  };
}

export const initialState: SearchState = {
  filters: {
    dirty: false,
    loading: false,
    autocompleteLoading: false,
    items: filterItemAdapter.getInitialState(),
    searchText: {
      field: undefined,
      value: undefined,
    },
    errorMessage: undefined,
  },
  referenceTypes: {
    loading: false,
    items: undefined,
    tooManyResults: false,
    resultCount: 0,
    errorMessage: undefined,
  },
};

const sortFilterItem = (item: FilterItem) => {
  const tmp = { ...item };

  if (tmp.type === FilterItemType.ID_VALUE) {
    (tmp as FilterItemIdValue).items = (tmp as FilterItemIdValue).items
      .slice()
      .sort((a, b) => (a.selected === b.selected ? 0 : a.selected ? -1 : 1));
  }

  return tmp;
};

const sortFilterItems = (items: FilterItem[]) => {
  const itemsCopy: FilterItem[] = [];

  items.forEach((item: FilterItem) => {
    itemsCopy.push(sortFilterItem(item));
  });

  return itemsCopy;
};

export const searchReducer = createReducer(
  initialState,
  // initial filters
  on(loadInitialFilters, (state: SearchState) => ({
    ...state,
    filters: { ...state.filters, loading: true, errorMessage: undefined },
  })),
  on(loadInitialFiltersSuccess, (state: SearchState, { items }) => ({
    ...state,
    filters: {
      ...state.filters,
      loading: false,
      items: filterItemAdapter.setAll(
        sortFilterItems(items),
        state.filters.items
      ),
    },
  })),
  on(loadInitialFiltersFailure, (state: SearchState, { errorMessage }) => ({
    ...state,
    filters: { ...state.filters, errorMessage, loading: false },
  })),

  // search
  on(search, (state: SearchState) => ({
    ...state,
    referenceTypes: {
      ...state.referenceTypes,
      loading: true,
      errorMessage: undefined,
    },
  })),
  on(searchSuccess, (state: SearchState, { searchResult }) => ({
    ...state,
    filters: {
      ...state.filters,
      items:
        +searchResult.resultCount === 0
          ? state.filters.items
          : filterItemAdapter.upsertMany(
              sortFilterItems(searchResult.filters),
              state.filters.items
            ),
    },
    referenceTypes: {
      ...state.referenceTypes,
      items: searchResult.result,
      loading: false,
      tooManyResults: searchResult.resultCount > 500,
      resultCount: searchResult.resultCount,
    },
  })),
  on(searchFailure, (state: SearchState, { errorMessage }) => ({
    ...state,
    referenceTypes: {
      ...state.referenceTypes,
      errorMessage,
      loading: false,
    },
  })),

  // apply textSearch
  on(applyTextSearch, (state: SearchState) => ({
    ...state,
    referenceTypes: {
      ...state.referenceTypes,
      loading: true,
      errorMessage: undefined,
    },
  })),
  on(applyTextSearchSuccess, (state: SearchState, { searchResult }) => ({
    ...state,
    filters: {
      ...state.filters,
      items: filterItemAdapter.setAll(
        sortFilterItems(searchResult.filters),
        state.filters.items
      ),
    },
    referenceTypes: {
      ...state.referenceTypes,
      items: searchResult.result,
      loading: false,
      tooManyResults: !searchResult.result,
    },
  })),
  on(applyTextSearchFailure, (state: SearchState, { errorMessage }) => ({
    ...state,
    referenceTypes: {
      ...state.referenceTypes,
      errorMessage,
      loading: false,
    },
  })),

  // entity changes
  on(updateFilter, (state: SearchState, { item }) => ({
    ...state,
    filters: {
      ...state.filters,
      dirty: true,
      items: filterItemAdapter.upsertOne(
        sortFilterItem(item),
        state.filters.items
      ),
    },
  })),
  on(resetFilters, (state: SearchState) => ({
    ...state,
    filters: {
      ...state.filters,
      dirty: false,
      items: filterItemAdapter.map(resetFilterItems, state.filters.items),
    },
    referenceTypes: {
      ...state.referenceTypes,
      items: undefined,
      loading: false,
    },
  })),

  // additional functionality
  on(shareSearchResult, (state: SearchState) => state),
  on(autocomplete, (state: SearchState) => ({
    ...state,
    filters: { ...state.filters, autocompleteLoading: true },
  })),
  on(autocompleteSuccess, (state: SearchState, { item }) => ({
    ...state,
    filters: {
      ...state.filters,
      autocompleteLoading: false,
      items: filterItemAdapter.upsertOne(
        sortFilterItem(item),
        state.filters.items
      ),
    },
  })),
  on(autocompleteFailure, (state: SearchState) => ({
    ...state,
    filters: { ...state.filters, autocompleteLoading: false },
  }))
);

// tslint:disable-next-line: only-arrow-functions
export function reducer(state: SearchState, action: Action): SearchState {
  return searchReducer(state, action);
}
