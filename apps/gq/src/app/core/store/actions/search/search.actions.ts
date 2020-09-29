import { createAction, props, union } from '@ngrx/store';

import { AutocompleteSearch, IdValue } from '../../models';

export const autocomplete = createAction(
  '[Search] Get Autocomplete Suggestions For Provided Filter Type',
  props<{ autocompleteSearch: AutocompleteSearch }>()
);

export const autocompleteSuccess = createAction(
  '[Search] Get Autocomplete Suggestions For Provided Filter Type Success',
  props<{ filter: string; options: IdValue[] }>()
);

export const autocompleteFailure = createAction(
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

const all = union({
  autocomplete,
  autocompleteSuccess,
  autocompleteFailure,
  selectedFilterChange,
  addOption,
  removeOption,
});

export type SearchActions = typeof all;
