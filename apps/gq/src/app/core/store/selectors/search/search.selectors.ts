import { createSelector } from '@ngrx/store';

import { FilterItem, QueryItem } from '../../models';
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

export const getIsInvalidTransaction = createSelector(
  getSearchState,
  (state: SearchState): boolean => !isValidTransaction(state)
);

export const getQueryList = createSelector(
  getSearchState,
  (state: SearchState): QueryItem[] => state.queryList
);

const isValidTransaction = (state: SearchState): boolean => {
  // Valid Case 1: quotation number is entered
  // Valid Case 2: queryKeyExists, materialnumberExists and quanitityExists

  let queryKeyValid = false;
  let quotationValid = false;
  let materialnumberValid = false;
  let quantityValid = false;

  const { items } = state.filters;

  for (const item of items) {
    if (item.filter === state.filters.selected) {
      for (const option of item.options) {
        if (option.selected) {
          queryKeyValid = true;
          quotationValid = state.filters.selected === 'quotation';
          break;
        }
      }
    }
    if (item.filter === 'materialNumber') {
      materialnumberValid = item.options.some((el) => el.selected);
    } else if (item.filter === 'quantity') {
      quantityValid = item.options.some((el) => el.selected);
    }
  }

  return (
    quotationValid || (queryKeyValid && materialnumberValid && quantityValid)
  );
};
