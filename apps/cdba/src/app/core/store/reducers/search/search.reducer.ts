import { Action, createReducer, on } from '@ngrx/store';

import { DEFAULT_RESULTS_THRESHOLD } from '@cdba/shared/constants/reference-type';
import { ReferenceType } from '@cdba/shared/models';

import {
  applyTextSearch,
  applyTextSearchFailure,
  applyTextSearchSuccess,
  autocomplete,
  autocompleteFailure,
  autocompleteSuccess,
  deselectReferenceType,
  loadInitialFilters,
  loadInitialFiltersFailure,
  loadInitialFiltersSuccess,
  resetFilters,
  search,
  searchFailure,
  searchSuccess,
  selectReferenceTypes,
  shareSearchResult,
  updateFilter,
} from '../../actions/search/search.actions';
import {
  filterItemAdapter,
  FilterItemState,
  resetFilterItems,
} from './filter-item.entity';
import {
  FilterItem,
  FilterItemIdValue,
  FilterItemRange,
  FilterItemType,
} from './models';

export interface SearchState {
  filters: {
    dirty: boolean;
    loading: boolean;
    items: FilterItemState;
    searchText: {
      field: string;
      value: string;
    };
    errorMessage: string;
  };
  referenceTypes: {
    loading: boolean;
    items: ReferenceType[];
    selectedNodeIds: string[];
    tooManyResults: boolean;
    tooManyResultsThreshold: number;
    resultCount: number;
    errorMessage: string;
  };
}

export const initialState: SearchState = {
  filters: {
    dirty: false,
    loading: false,
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
    selectedNodeIds: undefined,
    tooManyResults: false,
    tooManyResultsThreshold: DEFAULT_RESULTS_THRESHOLD,
    resultCount: 0,
    errorMessage: undefined,
  },
};

const changeAutocompleteLoading = (
  item: FilterItem,
  isLoadingAutocomplete: boolean
) => {
  const tmp = { ...item };

  if (tmp.type === FilterItemType.ID_VALUE) {
    (tmp as FilterItemIdValue).autocompleteLoading = isLoadingAutocomplete;
  }

  return tmp;
};

export const searchReducer = createReducer(
  initialState,
  // initial filters
  on(
    loadInitialFilters,
    (state: SearchState): SearchState => ({
      ...state,
      filters: {
        ...state.filters,
        loading: true,
        errorMessage: initialState.filters.errorMessage,
      },
    })
  ),
  on(
    loadInitialFiltersSuccess,
    (state: SearchState, { items }): SearchState => ({
      ...state,
      filters: {
        ...state.filters,
        loading: false,
        items: filterItemAdapter.setAll(items, state.filters.items),
      },
    })
  ),
  on(
    loadInitialFiltersFailure,
    (state: SearchState, { errorMessage }): SearchState => ({
      ...state,
      filters: { ...state.filters, errorMessage, loading: false },
    })
  ),

  // search
  on(
    search,
    (state: SearchState): SearchState => ({
      ...state,
      referenceTypes: {
        ...initialState.referenceTypes,
        loading: true,
        tooManyResultsThreshold: state.referenceTypes.tooManyResultsThreshold,
      },
    })
  ),
  on(
    searchSuccess,
    (state: SearchState, { searchResult }): SearchState => ({
      ...state,
      filters: {
        ...state.filters,
        items:
          +searchResult.count === 0
            ? state.filters.items
            : filterItemAdapter.upsertMany(
                searchResult.filters,
                state.filters.items
              ),
      },
      referenceTypes: {
        ...state.referenceTypes,
        items: searchResult.results,
        loading: false,
        tooManyResults:
          searchResult.count > state.referenceTypes.tooManyResultsThreshold,
        resultCount: searchResult.count,
      },
    })
  ),
  on(
    searchFailure,
    (state: SearchState, { errorMessage }): SearchState => ({
      ...state,
      referenceTypes: {
        ...state.referenceTypes,
        errorMessage,
        loading: false,
      },
    })
  ),

  // apply textSearch
  on(
    applyTextSearch,
    (state: SearchState): SearchState => ({
      ...state,
      referenceTypes: {
        ...state.referenceTypes,
        loading: true,
        errorMessage: initialState.referenceTypes.errorMessage,
      },
    })
  ),
  on(
    applyTextSearchSuccess,
    (state: SearchState, { searchResult }): SearchState => ({
      ...state,
      filters: {
        ...state.filters,
        items: filterItemAdapter.setAll(
          searchResult.filters,
          state.filters.items
        ),
      },
      referenceTypes: {
        ...state.referenceTypes,
        items: searchResult.results,
        loading: false,
        tooManyResults: !searchResult.results,
      },
    })
  ),
  on(
    applyTextSearchFailure,
    (state: SearchState, { errorMessage }): SearchState => ({
      ...state,
      referenceTypes: {
        ...state.referenceTypes,
        errorMessage,
        loading: false,
      },
    })
  ),

  // entity changes
  on(
    updateFilter,
    (state: SearchState, { filter }): SearchState => ({
      ...state,
      filters: {
        ...state.filters,
        dirty: true,
        items: filterItemAdapter.upsertOne(filter, state.filters.items),
      },
      referenceTypes: {
        ...state.referenceTypes,
        tooManyResultsThreshold:
          filter.name === 'limit'
            ? (filter as FilterItemRange).maxSelected
            : state.referenceTypes.tooManyResultsThreshold,
      },
    })
  ),
  on(
    resetFilters,
    (state: SearchState): SearchState => ({
      ...state,
      filters: {
        ...state.filters,
        dirty: false,
        items: filterItemAdapter.map(
          (element) => resetFilterItems(element),
          // eslint thinks it is the Array.map method but it is the method from the filterItemAdapter
          // eslint-disable-next-line unicorn/no-array-method-this-argument
          state.filters.items
        ),
      },
      referenceTypes: {
        ...initialState.referenceTypes,
      },
    })
  ),

  // additional functionality
  on(shareSearchResult, (state: SearchState): SearchState => state),

  on(
    autocomplete,
    (state: SearchState, { filter: item }): SearchState => ({
      ...state,
      filters: {
        ...state.filters,
        items: filterItemAdapter.upsertOne(
          changeAutocompleteLoading(item, true),
          state.filters.items
        ),
      },
    })
  ),

  on(
    autocompleteSuccess,
    (state: SearchState, { item }): SearchState => ({
      ...state,
      filters: {
        ...state.filters,
        items: filterItemAdapter.upsertOne(
          changeAutocompleteLoading(item, false),
          state.filters.items
        ),
      },
    })
  ),
  on(
    autocompleteFailure,
    (state: SearchState, { item }): SearchState => ({
      ...state,
      filters: {
        ...state.filters,
        items: filterItemAdapter.upsertOne(
          changeAutocompleteLoading(item, false),
          state.filters.items
        ),
      },
    })
  ),
  on(
    selectReferenceTypes,
    (state, { nodeIds }): SearchState => ({
      ...state,
      referenceTypes: { ...state.referenceTypes, selectedNodeIds: nodeIds },
    })
  ),
  on(deselectReferenceType, (state, { nodeId }): SearchState => {
    const selectedNodeIds = [...state.referenceTypes.selectedNodeIds];
    const indexOfNodeId = selectedNodeIds.indexOf(nodeId);

    return indexOfNodeId > -1
      ? {
          ...state,
          referenceTypes: {
            ...state.referenceTypes,
            selectedNodeIds: [
              ...selectedNodeIds.filter((id: string) => id !== nodeId),
            ],
          },
        }
      : state;
  })
);

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function reducer(state: SearchState, action: Action): SearchState {
  return searchReducer(state, action);
}
