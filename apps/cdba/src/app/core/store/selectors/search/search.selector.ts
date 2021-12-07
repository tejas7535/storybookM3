import { ReferenceType } from '@cdba/shared/models';
import { Dictionary } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';

import { getSearchState } from '../../reducers';
import { filterItemAdapter } from '../../reducers/search/filter-item.entity';
import {
  FilterItem,
  FilterItemIdValue,
  FilterItemIdValueUpdate,
  FilterItemRange,
  FilterItemRangeUpdate,
  FilterItemType,
  IdValue,
} from '../../reducers/search/models';
import { SearchState } from '../../reducers/search/search.reducer';

export const getInitialFiltersLoading = createSelector(
  getSearchState,
  (state: SearchState) => state.filters.loading
);

const { selectAll, selectEntities } = filterItemAdapter.getSelectors();

const getFiltersEntityState = createSelector(
  getSearchState,
  (state: SearchState) => state.filters.items
);

export const getFilters = createSelector(getFiltersEntityState, selectAll);

const mapSelectedFilters = (
  filters: FilterItem[]
): (FilterItemIdValueUpdate | FilterItemRangeUpdate)[] => {
  const mapped = filters
    .filter(
      (filter: FilterItem) =>
        filter.type === FilterItemType.ID_VALUE ||
        filter.type === FilterItemType.RANGE
    )
    .map((filter: FilterItem) => {
      if (filter.type === FilterItemType.ID_VALUE) {
        return new FilterItemIdValueUpdate(
          filter.name,
          (filter as FilterItemIdValue).items
            .filter((it) => it.selected)
            .map((it) => it.id)
        );
      }

      return new FilterItemRangeUpdate(
        filter.name,
        (filter as FilterItemRange).minSelected,
        (filter as FilterItemRange).maxSelected
      );
    })
    .filter(
      (filter: FilterItemIdValueUpdate | FilterItemRangeUpdate) =>
        (filter.type === FilterItemType.ID_VALUE &&
          (filter as FilterItemIdValueUpdate).ids.length > 0) ||
        (filter.type === FilterItemType.RANGE &&
          (filter as FilterItemRangeUpdate).minSelected !== null &&
          (filter as FilterItemRangeUpdate).maxSelected !== null)
    );

  return mapped;
};

export const getSelectedFilters = createSelector(
  getFilters,
  mapSelectedFilters
);

export const getSelectedIdValueFilters = createSelector(
  getSelectedFilters,
  (filters: (FilterItemIdValueUpdate | FilterItemRangeUpdate)[]) =>
    filters.filter(
      (filter: FilterItem) => filter.type === FilterItemType.ID_VALUE
    )
);

const getSelectedOptionsByName = (
  filterItemEntities: Dictionary<FilterItem>,
  props: any
) => {
  const filter = filterItemEntities[props.name];

  const options =
    filter?.type === FilterItemType.ID_VALUE
      ? (filter as FilterItemIdValue).items.filter(
          (item: IdValue) => item.selected
        )
      : [];

  return options;
};

const getFilterEntities = createSelector(getFiltersEntityState, selectEntities);

export const getSelectedFilterIdValueOptionsByFilterName = createSelector(
  getFilterEntities,
  getSelectedOptionsByName
);

export const getResultCount = createSelector(
  getSearchState,
  (state: SearchState) => state.referenceTypes.resultCount
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

export const getNoResultsFound = createSelector(
  getSearchState,
  (state: SearchState) =>
    state.referenceTypes.items !== undefined &&
    state.referenceTypes.resultCount === 0
);

export const getAutocompleteLoading = createSelector(
  getSearchState,
  (state: SearchState) => state.filters.autocompleteLoading
);

export const getIsDirty = createSelector(
  getSearchState,
  (state: SearchState) => state.filters.dirty
);

export const getSelectedRefTypeNodeIds = createSelector(
  getSearchState,
  (state: SearchState): string[] => state.referenceTypes.selectedNodeIds
);

export const getMaterialDesignationOfSelectedRefType = createSelector(
  getReferenceTypes,
  getSelectedRefTypeNodeIds,
  (referenceTypes: ReferenceType[], nodeIds: string[]): string =>
    nodeIds?.length === 1
      ? referenceTypes[+nodeIds[0]]?.materialDesignation
      : undefined
);
