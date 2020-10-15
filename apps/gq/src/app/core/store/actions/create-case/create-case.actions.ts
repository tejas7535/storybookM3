import { createAction, props, union } from '@ngrx/store';

import { AutocompleteSearch, IdValue } from '../../models';

export const autocomplete = createAction(
  '[Create Case] Get Autocomplete Suggestions For Customer or Quotation',
  props<{ autocompleteSearch: AutocompleteSearch }>()
);

export const autocompleteFailure = createAction(
  '[Create Case] Get Autocomplete Suggestions For Provided Customer or Quotation Failure'
);

export const autocompleteQuotationSuccess = createAction(
  '[Create Case] Get Autocomplete Suggestions For Quotation Success',
  props<{ options: IdValue[] }>()
);

export const autocompleteCustomerSuccess = createAction(
  '[Create Case] Get Autocomplete Suggestions For Customer Success',
  props<{ options: IdValue[] }>()
);

export const selectQuotationOption = createAction(
  '[Create Case] Select Option for Quotation Number',
  props<{ option: IdValue }>()
);

export const unselectQuotationOptions = createAction(
  '[Create Case] UnSelect Options for Quotation Number'
);

const all = union({
  autocomplete,
  autocompleteQuotationSuccess,
  autocompleteFailure,
  autocompleteCustomerSuccess,
  selectQuotationOption,
  unselectQuotationOptions,
});

export type createCaseActions = typeof all;
