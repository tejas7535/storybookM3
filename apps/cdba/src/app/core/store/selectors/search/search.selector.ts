import { createSelector } from '@ngrx/store';

import { getSearchState } from '../../reducers';
import { filterItemAdapter } from '../../reducers/search/filter-item.entity';
import {
  FilterItem,
  FilterItemIdValue,
  FilterItemRange,
  FilterItemType,
  IdValue,
} from '../../reducers/search/models';
import { SearchState } from '../../reducers/search/search.reducer';

export const getInitialFiltersLoading = createSelector(
  getSearchState,
  (state: SearchState) => state.filters.loading
);

const { selectAll } = filterItemAdapter.getSelectors();

const getSelectedFiltersEntityState = createSelector(
  getSearchState,
  (state: SearchState) => state.filters.selected
);

const getPossibleFiltersEntityState = createSelector(
  getSearchState,
  (state: SearchState) => state.filters.possible
);

export const getSelectedFilters = createSelector(
  getSelectedFiltersEntityState,
  selectAll
);

export const getPossibleFilters = createSelector(
  getPossibleFiltersEntityState,
  selectAll
);

const mergeIdValueFilter = (
  filter: FilterItemIdValue,
  selectedFilter: FilterItemIdValue
): FilterItemIdValue => {
  const items: IdValue[] = filter.items.map((item) => ({
    ...item,
    selected: selectedFilter.items.find((it) => it.id === item.id)?.selected,
  }));

  return { ...filter, items };
};

const mergeRangeFilter = (
  filter: FilterItemRange,
  selectedFilter: FilterItemRange
): FilterItemRange => ({
  ...filter,
  minSelected: selectedFilter?.minSelected,
  maxSelected: selectedFilter?.maxSelected,
});

const mergePossibleAndSelectedFilters = (
  possibleFilters: FilterItem[],
  selectedFilters: FilterItem[]
) => {
  const combinedFilters: FilterItem[] = [];

  possibleFilters.forEach((filter) => {
    // check if this filter has selections
    const selectedFilter = selectedFilters.find((f) => f.name === filter.name);

    if (selectedFilter) {
      // set selected value(s) dependent on filter item type
      if (filter.type === FilterItemType.ID_VALUE) {
        combinedFilters.push(
          mergeIdValueFilter(
            filter as FilterItemIdValue,
            selectedFilter as FilterItemIdValue
          )
        );
      } else {
        // filter.type === FilterItemType.RANGE
        combinedFilters.push(
          mergeRangeFilter(
            filter as FilterItemRange,
            selectedFilter as FilterItemRange
          )
        );
      }
    } else {
      combinedFilters.push(filter);
    }
  });

  return combinedFilters;
};

export const getAllFilters = createSelector(
  getPossibleFilters,
  getSelectedFilters,
  mergePossibleAndSelectedFilters
);

export const getSearchText = createSelector(
  getSearchState,
  (state: SearchState) => state.filters.searchText
);

export const getReferenceTypes = createSelector(
  getSearchState,
  (state: SearchState) => state.referenceTypes.items
);

export const getReferenceTypesLoading = createSelector(
  getSearchState,
  (state: SearchState) => state.referenceTypes.loading
);

export const getTooManyResults = createSelector(
  getSearchState,
  (state: SearchState) => state.referenceTypes.tooManyResults
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
