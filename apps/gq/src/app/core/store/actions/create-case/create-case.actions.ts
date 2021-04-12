import { createAction, props, union } from '@ngrx/store';

import {
  AutocompleteSearch,
  CreateCaseResponse,
  IdValue,
  MaterialTableItem,
  MaterialValidation,
  SalesOrg,
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
  props<{ items: MaterialTableItem[] }>()
);

export const pasteRowDataItems = createAction(
  '[Create Case] Paste new Items to Customer Table',
  props<{ items: MaterialTableItem[]; pasteDestination: MaterialTableItem }>()
);

export const clearCreateCaseRowData = createAction(
  '[Create Case] Clear RowData'
);

export const deleteRowDataItem = createAction(
  '[Create Case] Delete Item from Customer Table',
  props<{ materialNumber: string; quantity: number }>()
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
  '[Create Case] CreateCase from table and selected customer Failure',
  props<{ errorMessage: string }>()
);

export const importCase = createAction('[Create Case] Import SAP Quotation');

export const importCaseSuccess = createAction(
  '[Create Case] Import SAP Quotation Success',
  props<{ gqId: number }>()
);

export const importCaseFailure = createAction(
  '[Create Case] Import SAP Quotation Failure',
  props<{ errorMessage: string }>()
);

export const getSalesOrgsSuccess = createAction(
  '[Create Case] Get Sales Organisations For Customer Success',
  props<{ salesOrgs: SalesOrg[] }>()
);

export const getSalesOrgsFailure = createAction(
  '[Create Case] Get Sales Organisations For Customer Failure',
  props<{ errorMessage: string }>()
);

export const selectSalesOrg = createAction(
  '[Create Case] Select Sales Organisation For Customer',
  props<{ salesOrgId: string }>()
);

const all = union({
  addRowDataItem,
  autocomplete,
  autocompleteFailure,
  autocompleteSuccess,
  clearCreateCaseRowData,
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
  getSalesOrgsSuccess,
  getSalesOrgsFailure,
  selectSalesOrg,
});

export type createCaseActions = typeof all;
