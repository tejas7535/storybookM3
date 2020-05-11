import { Update } from '@ngrx/entity';
import { createAction, props, union } from '@ngrx/store';

import {
  FilterItem,
  FilterItemIdValue,
  FilterItemRange,
  SearchResult,
  TextSearch,
} from '../../reducers/search/models';

export const getInitialFilters = createAction('[Search] Load Initial Filters');

export const getInitialFiltersSuccess = createAction(
  '[Search] Load Initial Filters Success',
  props<{ items: FilterItem[] }>()
);

export const getInitialFiltersFailure = createAction(
  '[Search] Load Initial Filters Failure'
);

export const search = createAction('[Search] Search Reference Types');

export const searchSuccess = createAction(
  '[Search] Search Reference Types Success',
  props<{ searchResult: SearchResult }>()
);

export const searchFailure = createAction(
  '[Search] Search Reference Types Failure'
);

export const addFilter = createAction(
  '[Search] Add Filter',
  props<{ item: FilterItem }>()
);

export const updateFilter = createAction(
  '[Search] Update Filter',
  props<{ item: Update<FilterItemRange | FilterItemIdValue> }>()
);

export const removeFilter = createAction(
  '[Search] Remove Filter',
  props<{ name: string }>()
);

export const applyTextSearch = createAction(
  '[Search] Apply Text Search',
  props<{ textSearch: TextSearch }>()
);

export const applyTextSearchSuccess = createAction(
  '[Search] Apply Text Search Success',
  props<{ searchResult: SearchResult }>()
);
export const applyTextSearchFailure = createAction(
  '[Search] Apply Text Search Failure'
);

export const resetFilters = createAction('[Search] Reset All Filters');

export const shareSearchResult = createAction('[Search] Share Search Result');

export const autocomplete = createAction(
  '[Search] Get Autocomplete Suggestions For Provided Filter Type',
  props<{ textSearch: TextSearch }>()
);

export const autocompleteSuccess = createAction(
  '[Search] Get Autocomplete Suggestions For Provided Filter Type Success',
  props<{ item: FilterItem }>()
);

export const autocompleteFailure = createAction(
  '[Search] Get Autocomplete Suggestions For Provided Filter Type Failure'
);

const all = union({
  getInitialFilters,
  getInitialFiltersSuccess,
  getInitialFiltersFailure,
  search,
  searchSuccess,
  searchFailure,
  applyTextSearch,
  applyTextSearchSuccess,
  applyTextSearchFailure,
  addFilter,
  updateFilter,
  removeFilter,
  resetFilters,
  shareSearchResult,
  autocomplete,
  autocompleteSuccess,
  autocompleteFailure,
});

export type SearchActions = typeof all;
