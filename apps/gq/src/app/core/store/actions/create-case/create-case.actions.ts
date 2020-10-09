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

const all = union({
  autocomplete,
  autocompleteQuotationSuccess,
  autocompleteFailure,
  autocompleteCustomerSuccess,
});

export type createCaseActions = typeof all;
