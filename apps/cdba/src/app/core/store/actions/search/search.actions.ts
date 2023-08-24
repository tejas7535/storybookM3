import { createAction, props, union } from '@ngrx/store';

import {
  FilterItem,
  SearchResult,
  TextSearch,
} from '../../reducers/search/models';

export const loadInitialFilters = createAction('[Search] Load Initial Filters');

export const loadInitialFiltersSuccess = createAction(
  '[Search] Load Initial Filters Success',
  props<{ items: FilterItem[] }>()
);

export const loadInitialFiltersFailure = createAction(
  '[Search] Load Initial Filters Failure',
  props<{ errorMessage: string }>()
);

export const search = createAction('[Search] Search Reference Types');

export const searchSuccess = createAction(
  '[Search] Search Reference Types Success',
  props<{ searchResult: SearchResult }>()
);

export const searchFailure = createAction(
  '[Search] Search Reference Types Failure',
  props<{ errorMessage: string }>()
);

export const updateFilter = createAction(
  '[Search] Update Filter',
  props<{ item: FilterItem }>()
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
  '[Search] Apply Text Search Failure',
  props<{ errorMessage: string }>()
);

export const resetFilters = createAction('[Search] Reset All Filters');

export const shareSearchResult = createAction('[Search] Share Search Result');

export const autocomplete = createAction(
  '[Search] Get Autocomplete Suggestions For Provided Filter Type',
  props<{ searchFor: string; filter: FilterItem }>()
);

export const autocompleteSuccess = createAction(
  '[Search] Get Autocomplete Suggestions For Provided Filter Type Success',
  props<{ item: FilterItem }>()
);

export const autocompleteFailure = createAction(
  '[Search] Get Autocomplete Suggestions For Provided Filter Type Failure',
  props<{ item: FilterItem }>()
);

export const selectReferenceTypes = createAction(
  '[Search] Select Reference Types',
  props<{ nodeIds: string[] }>()
);

export const deselectReferenceType = createAction(
  '[Search] Deselect Reference Type',
  props<{ nodeId: string }>()
);

const all = union({
  loadInitialFilters,
  loadInitialFiltersSuccess,
  loadInitialFiltersFailure,
  search,
  searchSuccess,
  searchFailure,
  applyTextSearch,
  applyTextSearchSuccess,
  applyTextSearchFailure,
  updateFilter,
  resetFilters,
  shareSearchResult,
  autocomplete,
  autocompleteSuccess,
  autocompleteFailure,
  selectReferenceTypes,
  deselectReferenceType,
});

export type SearchActions = typeof all;
