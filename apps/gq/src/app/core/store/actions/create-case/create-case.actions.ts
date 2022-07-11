import { createAction, props, union } from '@ngrx/store';

import { AutocompleteSearch, IdValue } from '../../../../shared/models/search';
import {
  MaterialTableItem,
  MaterialValidation,
} from '../../../../shared/models/table';
import { PLsSeriesRequest } from '../../../../shared/services/rest-services/search-service/models/pls-series-request.model';
import {
  CreateCaseResponse,
  SalesOrg,
} from '../../reducers/create-case/models';
import { PLsAndSeries } from '../../reducers/create-case/models/pls-and-series.model';

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
export const setSelectedAutocompleteOption = createAction(
  '[Create Case] Set selected option for Autocomplete Filter',
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
  props<{ items: MaterialTableItem[] }>()
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

export const getPLsAndSeries = createAction(
  '[Create Case] Get Product lines and Series',
  props<{ customerFilters: PLsSeriesRequest }>()
);
export const getPLsAndSeriesSuccess = createAction(
  '[Create Case] Get Product lines and Series Success',
  props<{ plsAndSeries: PLsAndSeries }>()
);

export const getPLsAndSeriesFailure = createAction(
  '[Create Case] Get Product lines and Series Failure',
  props<{ errorMessage: string }>()
);

export const setSelectedProductLines = createAction(
  '[Create Case] Set Selected Product Lines',
  props<{ selectedProductLines: string[] }>()
);

export const setSelectedSeries = createAction(
  '[Create Case] Set Selected Series',
  props<{ selectedSeries: string[] }>()
);

export const resetProductLineAndSeries = createAction(
  '[Create Case] Reset ProductLineAndSeries'
);

export const createCustomerCase = createAction(
  '[Create Case] Create Customer Case'
);

export const createCustomerCaseSuccess = createAction(
  '[Create Case] Create Customer Case Success'
);

export const createCustomerCaseFailure = createAction(
  '[Create Case] Create Customer Case Failure',
  props<{ errorMessage: string }>()
);

export const resetCustomerFilter = createAction(
  '[Create Case] Reset Autocomplete Customer'
);
export const resetPLsAndSeries = createAction(
  '[Create Case] Reset PLs and Series'
);

export const resetAllAutocompleteOptions = createAction(
  '[Create Case] Reset all autocomplete options'
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
