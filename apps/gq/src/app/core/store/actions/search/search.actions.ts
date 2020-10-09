import { createAction, props, union } from '@ngrx/store';

import { AutocompleteSearch, IdValue, QueryItem } from '../../models';

/*
 * @deprecated
 */
export const autocompleteDepr = createAction(
  '[Search] Get Autocomplete Suggestions For Provided Filter Type',
  props<{ autocompleteSearch: AutocompleteSearch }>()
);

/*
 * @deprecated
 */
export const autocompleteSuccessDepr = createAction(
  '[Search] Get Autocomplete Suggestions For Provided Filter Type Success',
  props<{ filter: string; options: IdValue[] }>()
);

/*
 * @deprecated
 */
export const autocompleteFailureDepr = createAction(
  '[Search] Get Autocomplete Suggestions For Provided Filter Type Failure'
);

export const selectedFilterChange = createAction(
  '[Search] Update Selected Input For Selection Change',
  props<{ filterName: string }>()
);

export const addOption = createAction(
  '[Search] Add Option For Filter',
  props<{ option: IdValue; filterName: string }>()
);

export const removeOption = createAction(
  '[Search] Remove Action Of Filter',
  props<{ option: IdValue; filterName: string }>()
);

export const createQueries = createAction('[Search] Create Queries For Filter');

export const removeQueryItem = createAction(
  '[Search] Remove Query Item',
  props<{ queryItem: QueryItem }>()
);

const all = union({
  autocompleteDepr,
  autocompleteSuccessDepr,
  autocompleteFailureDepr,
  selectedFilterChange,
  addOption,
  removeOption,
  removeQueryItem,
});

export type SearchActions = typeof all;
