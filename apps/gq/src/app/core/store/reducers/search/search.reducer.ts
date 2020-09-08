import { Action, createReducer, on } from '@ngrx/store';

import {
  autocomplete,
  autocompleteFailure,
  autocompleteSuccess,
  updateFilter,
} from '../../actions';
import { FilterItem } from '../../models';
import { filterItemAdapter, FilterItemState } from './filter-item.entity';

export interface SearchState {
  filters: {
    dirty: boolean;
    autocompleteLoading: boolean;
    items: FilterItemState;
    searchText: {
      field: string;
      value: string;
    };
    errorMessage: string;
  };
}

export const initialState: SearchState = {
  filters: {
    dirty: false,
    autocompleteLoading: false,
    items: filterItemAdapter.getInitialState(),
    searchText: {
      field: undefined,
      value: undefined,
    },
    errorMessage: undefined,
  },
};

const sortFilterItem = (item: FilterItem) => {
  const tmp = { ...item };

  (tmp as FilterItem).options = (tmp as FilterItem).options
    .slice()
    .sort((a, b) => (a.selected === b.selected ? 0 : a.selected ? -1 : 1));

  return tmp;
};

export const searchReducer = createReducer(
  initialState,
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
