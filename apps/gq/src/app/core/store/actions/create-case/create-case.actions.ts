import { createAction, props, union } from '@ngrx/store';

import { AutocompleteSearch, CaseTableItem, IdValue } from '../../models';

export const autocomplete = createAction(
  '[Create Case] Get Autocomplete Suggestions For Autocomplete Option',
  props<{ autocompleteSearch: AutocompleteSearch }>()
);

export const autocompleteFailure = createAction(
  '[Create Case] Get Autocomplete Suggestions For Autocomplete Option Failure'
);

export const autocompleteSuccess = createAction(
  '[Create Case] Get Autocomplete Suggestions For selected Autocomplete Option',
  props<{ options: IdValue[]; filter: string }>()
);

export const selectAutocompleteOption = createAction(
  '[Create Case] Select Option for selected Autocomplete Option',
  props<{ option: IdValue; filter: string }>()
);

export const unselectAutocompleteOptions = createAction(
  '[Create Case] Unselect Options for selected Autocomplete Option',
  props<{ filter: string }>()
);

export const addRowDataItem = createAction(
  '[Create Case] Add new Items to Customer Table',
  props<{ items: CaseTableItem[] }>()
);

export const clearRowData = createAction('[Create Case] Clear RowData');

export const deleteRowDataItem = createAction(
  '[Create Case] Delete Item from Customer Table',
  props<{ materialNumber: string }>()
);

const all = union({
  autocomplete,
  autocompleteFailure,
  autocompleteSuccess,
  selectAutocompleteOption,
  unselectAutocompleteOptions,
  addRowDataItem,
  clearRowData,
  deleteRowDataItem,
});

export type createCaseActions = typeof all;
