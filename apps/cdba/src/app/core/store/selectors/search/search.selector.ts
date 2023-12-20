import { Dictionary } from '@ngrx/entity';
import { createSelector } from '@ngrx/store';

import { FILTER_NAME_LIMIT } from '@cdba/shared/constants/filter-names';
import { ProductCostAnalysis, ReferenceType } from '@cdba/shared/models';

import { getSearchState } from '../../reducers';
import { filterItemAdapter } from '../../reducers/search/filter-item.entity';
import {
  FilterItem,
  FilterItemIdValue,
  FilterItemRange,
  FilterItemType,
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

export const getFiltersWithoutLimit = createSelector(
  getFilters,
  (filters: FilterItem[]) =>
    filters.filter((filter) => filter.name !== FILTER_NAME_LIMIT)
);

export const getFilterByName = (filterName: string) =>
  createSelector(getFilters, (filters: FilterItem[]) =>
    filters.find((item) => item.name === filterName)
  );

export const getChangedFilters = createSelector(
  getFilters,
  (filters: FilterItem[]) =>
    filters
      .filter((filter) => {
        switch (filter.type) {
          case FilterItemType.ID_VALUE: {
            return (filter as FilterItemIdValue).selectedItems?.length > 0
              ? filter
              : undefined;
          }
          case FilterItemType.RANGE: {
            return !(filter as FilterItemRange).disabled &&
              (filter as FilterItemRange).validated
              ? filter
              : undefined;
          }
          default:
            return undefined;
        }
      })
      .filter((item) => item !== undefined)
);

export const getChangedIdValueFilters = createSelector(
  getChangedFilters,
  (selectedFilters: FilterItem[]) =>
    selectedFilters.filter(
      (filter: FilterItem) => filter.type === FilterItemType.ID_VALUE
    )
);

export const getFiltersForRequest = createSelector(
  getChangedFilters,
  // Limit filter will be added by default after it leaves the BetaFeature
  getFilterByName(FILTER_NAME_LIMIT),
  (filters: FilterItem[], limitFilter: FilterItem) =>
    filters.some((item) => item.name === FILTER_NAME_LIMIT)
      ? filters
      : [...filters, limitFilter]
);

const getSelectedOptionsByName = (
  filterItemEntities: Dictionary<FilterItem>,
  props: any
) => {
  const filter = filterItemEntities[props.name];

  const options =
    filter?.type === FilterItemType.ID_VALUE
      ? (filter as FilterItemIdValue).selectedItems
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

export const getTooManyResultsThreshold = createSelector(
  getSearchState,
  (state: SearchState) => state.referenceTypes.tooManyResultsThreshold
);

export const getNoResultsFound = createSelector(
  getSearchState,
  (state: SearchState) =>
    state.referenceTypes.items !== undefined &&
    state.referenceTypes.resultCount === 0
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

export const getPortfolioAnalysisDataForSelectedNodes = createSelector(
  getReferenceTypes,
  getSelectedRefTypeNodeIds,
  (referenceTypes, nodeIds): ProductCostAnalysis[] => {
    if (!referenceTypes || !nodeIds) {
      return [];
    }

    return nodeIds.map((id) => {
      const refType: ReferenceType = referenceTypes[+id];

      return new ProductCostAnalysis(
        refType.materialDesignation,
        refType.averagePrices[0],
        refType.sqvSapLatestMonth,
        refType.gpcLatestYear,
        id
      );
    });
  }
);
