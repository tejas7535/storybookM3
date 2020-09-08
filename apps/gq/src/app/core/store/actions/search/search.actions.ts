import { createAction, props, union } from '@ngrx/store';

import { FilterItem, TextSearch } from '../../models';

export const updateFilter = createAction(
  '[Search] Update Filter',
  props<{ item: FilterItem }>()
);

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
  autocomplete,
  autocompleteSuccess,
  autocompleteFailure,
  updateFilter,
});

export type SearchActions = typeof all;
