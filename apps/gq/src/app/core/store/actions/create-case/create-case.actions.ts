import { createAction, props, union } from '@ngrx/store';

import {
  AutocompleteSearch,
  CaseTableItem,
  CreateCaseResponse,
  IdValue,
  MaterialValidation,
  SapQuotation,
} from '../../models';

export const autocomplete = createAction(
  '[Create Case] Get Autocomplete Suggestions For Autocomplete Option',
  props<{ autocompleteSearch: AutocompleteSearch }>()
);

export const autocompleteFailure = createAction(
  '[Create Case] Get Autocomplete Suggestions For Autocomplete Option Failure'
);

export const autocompleteSuccess = createAction(
  '[Create Case] Get Autocomplete Suggestions For selected Autocomplete Option',
  props<{ options: IdValue[] | SapQuotation[]; filter: string }>()
);

export const selectAutocompleteOption = createAction(
  '[Create Case] Select Option for selected Autocomplete Option',
  props<{ option: IdValue | SapQuotation; filter: string }>()
);

export const unselectAutocompleteOptions = createAction(
  '[Create Case] Unselect Options for selected Autocomplete Option',
  props<{ filter: string }>()
);

export const addRowDataItem = createAction(
  '[Create Case] Add new Items to Customer Table',
  props<{ items: CaseTableItem[] }>()
);

export const pasteRowDataItems = createAction(
  '[Create Case] Paste new Items to Customer Table',
  props<{ items: CaseTableItem[]; pasteDestination: CaseTableItem }>()
);

export const clearRowData = createAction('[Create Case] Clear RowData');

export const deleteRowDataItem = createAction(
  '[Create Case] Delete Item from Customer Table',
  props<{ materialNumber: string }>()
);

export const validateFailure = createAction(
  '[Create Case] Get Validation for RowData Validation Failure'
);

export const validateSuccess = createAction(
  '[Create Case] Get Validation for RowData Validation Sucess',
  props<{ materialValidations: MaterialValidation[] }>()
);

export const createCase = createAction(
  '[Create Case] CreateCase from table and selected customer'
);

export const createCaseSuccess = createAction(
  '[Create Case] CreateCase from table and selected customer Success',
  props<{ createdCase: CreateCaseResponse }>()
);

export const createCaseFailure = createAction(
  '[Create Case] CreateCase from table and selected customer Failure'
);

export const importCase = createAction('[Create Case] Import SAP Quotation');

export const importCaseSuccess = createAction(
  '[Create Case] Import SAP Quotation Success',
  props<{ quotationNumber: string }>()
);

export const importCaseFailure = createAction(
  '[Create Case] Import SAP Quotation Failure'
);

const all = union({
  addRowDataItem,
  autocomplete,
  autocompleteFailure,
  autocompleteSuccess,
  clearRowData,
  createCase,
  createCaseFailure,
  createCaseSuccess,
  deleteRowDataItem,
  pasteRowDataItems,
  selectAutocompleteOption,
  unselectAutocompleteOptions,
  validateSuccess,
  validateFailure,
  importCase,
  importCaseSuccess,
  importCaseFailure,
});

export type createCaseActions = typeof all;
