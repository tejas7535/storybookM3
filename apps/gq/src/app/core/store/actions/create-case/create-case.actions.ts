import { AutocompleteRequestDialog } from '@gq/shared/components/autocomplete-input/autocomplete-request-dialog.enum';
import { FilterNames } from '@gq/shared/components/autocomplete-input/filter-names.enum';
import { PurchaseOrderType } from '@gq/shared/models';
import { OfferType } from '@gq/shared/models/offer-type.interface';
import { AutocompleteSearch, IdValue } from '@gq/shared/models/search';
import { SectorGpsd } from '@gq/shared/models/sector-gpsd.interface';
import { MaterialTableItem, MaterialValidation } from '@gq/shared/models/table';
import { PLsSeriesRequest } from '@gq/shared/services/rest/search/models/pls-series-request.model';
import { createAction, props, union } from '@ngrx/store';

import {
  CreateCaseResponse,
  SalesOrg,
} from '../../reducers/create-case/models';
import { CreateCaseHeaderData } from '../../reducers/create-case/models/create-case-header-data.interface';
import { PLsAndSeries } from '../../reducers/create-case/models/pls-and-series.model';

export const autocomplete = createAction(
  '[Create Case] Get Autocomplete Suggestions For Autocomplete Option',
  props<{ autocompleteSearch: AutocompleteSearch }>()
);

export const autocompleteFailure = createAction(
  '[Create Case] Get Autocomplete Suggestions For Autocomplete Option Failure'
);

export const autocompleteSuccess = createAction(
  '[Create Case] Get Autocomplete Suggestions For selected Autocomplete Option Success',
  props<{ options: IdValue[]; filter: FilterNames }>()
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

export const setRequestingAutoCompleteDialog = createAction(
  '[Create Case] Set Requesting autocomplete Dialog',
  props<{ dialog: AutocompleteRequestDialog }>()
);

export const resetRequestingAutoCompleteDialog = createAction(
  '[Create Case] Reset Requesting autocomplete Dialog'
);

export const addRowDataItems = createAction(
  '[Create Case] Add new Items to Customer Table',
  props<{ items: MaterialTableItem[] }>()
);

export const duplicateRowDataItem = createAction(
  '[Create Case] Duplicate Item by Id from Customer Table',
  props<{ itemId: number }>()
);

export const updateRowDataItem = createAction(
  '[Create Case] Update Item from Customer Table',
  props<{ item: MaterialTableItem; revalidate: boolean }>()
);

export const clearCreateCaseRowData = createAction(
  '[Create Case] Clear RowData'
);

export const deleteRowDataItem = createAction(
  '[Create Case] Delete Item from Customer Table',
  props<{ id: number }>()
);

export const validateMaterialsOnCustomerAndSalesOrg = createAction(
  '[Create Case] Validate for RowData Materials on Customer and SalesOrg'
);

export const validateMaterialsOnCustomerAndSalesOrgFailure = createAction(
  '[Create Case] Get Validation for RowData on Customer and SalesOrg: Validation Failure'
);

export const validateMaterialsOnCustomerAndSalesOrgSuccess = createAction(
  '[Create Case] Get Validation for RowData on Customer and SalesOrg: Validation Success',
  props<{
    materialValidations: MaterialValidation[];
    isNewCaseCreation: boolean;
  }>()
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

export const createOgpCase = createAction(
  '[Create Case] Create OGP Case',
  props<{ createCaseData: CreateCaseHeaderData }>()
);

export const createOgpCaseSuccess = createAction(
  '[Create Case] Create OGP Case Success',
  props<{ createdCase: CreateCaseResponse }>()
);
export const createOgpCaseFailure = createAction(
  '[Create Case] Create OGP Case Failure',
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
export const getSalesOrgsForShipToPartySuccess = createAction(
  '[Create Case] Get Sales Organizations For Ship to Success',
  props<{ salesOrgs: SalesOrg[] }>()
);

export const clearCustomer = createAction('[Create Case] Clear Customer');
export const clearShipToParty = createAction(
  '[Create Case] Clear Ship to Party'
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

export const setSelectedGpsdGroups = createAction(
  '[Create Case] Set Selected GPSD Groups',
  props<{ selectedGpsdGroups: string[] }>()
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

export const resetAutocompleteMaterials = createAction(
  '[Create Case] Reset all autocomplete material options'
);

export const selectPurchaseOrderType = createAction(
  '[Create Case] Select Purchase Order Type',
  props<{ purchaseOrderType: PurchaseOrderType }>()
);

export const clearPurchaseOrderType = createAction(
  '[Create Case] Reset Purchase Order Type'
);

export const selectSectorGpsd = createAction(
  '[Create Case] Select Sector Gpsd',
  props<{ sectorGpsd: SectorGpsd }>()
);

export const clearSectorGpsd = createAction('[Create Case] Reset Sector Gpsd');

export const selectOfferType = createAction(
  '[Create Case] Select Offer Type',
  props<{ offerType: OfferType }>()
);

export const clearOfferType = createAction('[Create Case] Reset Offer Type');

export const setRowDataCurrency = createAction(
  '[Create Case] Set RowData Currency',
  props<{ currency: string }>()
);
export const updateCurrencyOfPositionItems = createAction(
  '[Create Case] Update Currency of Position Items'
);

export const navigateToCaseOverView = createAction(
  '[Create Case] Back to Case Overview'
);
const all = union({
  addRowDataItems,
  duplicateRowDataItem,
  autocomplete,
  autocompleteFailure,
  autocompleteSuccess,
  clearCreateCaseRowData,
  createCase,
  createCaseFailure,
  createCaseSuccess,
  createOgpCase,
  createOgpCaseSuccess,
  createOgpCaseFailure,
  deleteRowDataItem,
  setSelectedAutocompleteOption,
  selectAutocompleteOption,
  unselectAutocompleteOptions,
  validateMaterialsOnCustomerAndSalesOrg,
  validateMaterialsOnCustomerAndSalesOrgSuccess,
  validateMaterialsOnCustomerAndSalesOrgFailure,
  importCase,
  importCaseSuccess,
  importCaseFailure,
  getSalesOrgsSuccess,
  getSalesOrgsFailure,
  selectSalesOrg,
  selectPurchaseOrderType,
  selectSectorGpsd,
  clearPurchaseOrderType,
  clearSectorGpsd,
  setRowDataCurrency,
  updateCurrencyOfPositionItems,
  navigateToCaseOverView,
});

export type createCaseActions = typeof all;
