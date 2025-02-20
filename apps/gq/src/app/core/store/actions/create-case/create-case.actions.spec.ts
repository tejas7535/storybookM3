import { AutocompleteRequestDialog } from '@gq/shared/components/autocomplete-input/autocomplete-request-dialog.enum';
import { FilterNames } from '@gq/shared/components/autocomplete-input/filter-names.enum';
import { AutocompleteSearch, IdValue } from '@gq/shared/models/search';
import { ValidationDescription } from '@gq/shared/models/table';
import { PLsSeriesRequest } from '@gq/shared/services/rest/search/models/pls-series-request.model';

import {
  CreateCaseResponse,
  SalesOrg,
} from '../../reducers/create-case/models';
import { CreateCaseHeaderData } from '../../reducers/create-case/models/create-case-header-data.interface';
import { PLsAndSeries } from '../../reducers/create-case/models/pls-and-series.model';
import { SalesIndication } from '../../transactions/models/sales-indication.enum';
import {
  addRowDataItems,
  autocomplete,
  autocompleteFailure,
  autocompleteSuccess,
  clearCreateCaseRowData,
  clearCustomer,
  createCase,
  createCaseFailure,
  createCaseSuccess,
  createCustomerCase,
  createCustomerCaseFailure,
  createCustomerCaseSuccess,
  createCustomerOgpCase,
  createCustomerOgpCaseFailure,
  createCustomerOgpCaseSuccess,
  createOgpCase,
  createOgpCaseFailure,
  createOgpCaseSuccess,
  deleteRowDataItem,
  getPLsAndSeries,
  getPLsAndSeriesFailure,
  getPLsAndSeriesSuccess,
  getSalesOrgsFailure,
  getSalesOrgsSuccess,
  importCase,
  importCaseFailure,
  importCaseSuccess,
  resetAllAutocompleteOptions,
  resetAutocompleteMaterials,
  resetCustomerFilter,
  resetPLsAndSeries,
  resetProductLineAndSeries,
  resetRequestingAutoCompleteDialog,
  selectAutocompleteOption,
  selectSalesOrg,
  setRequestingAutoCompleteDialog,
  setRowDataCurrency,
  setSelectedAutocompleteOption,
  setSelectedGpsdGroups,
  setSelectedProductLines,
  setSelectedSeries,
  unselectAutocompleteOptions,
  updateCurrencyOfPositionItems,
  updateRowDataItem,
  validateMaterialsOnCustomerAndSalesOrg,
  validateMaterialsOnCustomerAndSalesOrgFailure,
  validateMaterialsOnCustomerAndSalesOrgSuccess,
} from './create-case.actions';

describe('Create Actions', () => {
  describe('Autocomplete Actions', () => {
    test('autocomplete', () => {
      const autocompleteSearch = new AutocompleteSearch('customer', 'Awe');

      const action = autocomplete({ autocompleteSearch });

      expect(action).toEqual({
        autocompleteSearch,
        type: '[Create Case] Get Autocomplete Suggestions For Autocomplete Option',
      });
    });

    test('autocompleteFailure', () => {
      const action = autocompleteFailure();

      expect(action).toEqual({
        type: '[Create Case] Get Autocomplete Suggestions For Autocomplete Option Failure',
      });
    });

    test('autocompleteSuccess', () => {
      const options = [new IdValue('23', 'Test Customer', true)];
      const filter = FilterNames.CUSTOMER;
      const action = autocompleteSuccess({ options, filter });

      expect(action).toEqual({
        options,
        filter,
        type: '[Create Case] Get Autocomplete Suggestions For selected Autocomplete Option Success',
      });
    });

    test('selectAutocompleteOption', () => {
      const option = new IdValue('23', 'Test Customer', true);
      const filter = FilterNames.CUSTOMER;
      const action = selectAutocompleteOption({ option, filter });

      expect(action).toEqual({
        option,
        filter,
        type: '[Create Case] Select Option for selected Autocomplete Option',
      });
    });
    test('setSelectedAutocompleteOption', () => {
      const option = new IdValue('23', 'Test Customer', true);
      const filter = FilterNames.CUSTOMER;
      const action = setSelectedAutocompleteOption({ option, filter });

      expect(action).toEqual({
        option,
        filter,
        type: '[Create Case] Set selected option for Autocomplete Filter',
      });
    });
    test('unselectAutocompleteOption', () => {
      const filter = FilterNames.CUSTOMER;
      const action = unselectAutocompleteOptions({ filter });

      expect(action).toEqual({
        filter,
        type: '[Create Case] Unselect Options for selected Autocomplete Option',
      });
    });
    test('setRequestingAutoCompleteDialog', () => {
      const dialog = AutocompleteRequestDialog.ADD_ENTRY;
      const action = setRequestingAutoCompleteDialog({ dialog });

      expect(action).toEqual({
        dialog,
        type: '[Create Case] Set Requesting autocomplete Dialog',
      });
    });
    test('resetRequestingAutoCompleteDialog', () => {
      const action = resetRequestingAutoCompleteDialog();

      expect(action).toEqual({
        type: '[Create Case] Reset Requesting autocomplete Dialog',
      });
    });
  });

  describe('Table Row Data Actions', () => {
    test('addRowDataItem', () => {
      const items = [
        {
          materialNumber: '1234',
          quantity: 105,
          info: { valid: true, description: [ValidationDescription.Valid] },
        },
      ];

      const action = addRowDataItems({ items });

      expect(action).toEqual({
        items,
        type: '[Create Case] Add new Items to Customer Table',
      });
    });
    test('updateRowDataItem', () => {
      const item = {
        materialNumber: '1234',
        quantity: 105,
        info: { valid: true, description: [ValidationDescription.Valid] },
      };
      const action = updateRowDataItem({ item, revalidate: false });

      expect(action).toEqual({
        item,
        revalidate: false,
        type: '[Create Case] Update Item from Customer Table',
      });
    });
    test('clearRowData', () => {
      const action = clearCreateCaseRowData();

      expect(action).toEqual({
        type: '[Create Case] Clear RowData',
      });
    });

    test('deleteRowDataItem', () => {
      const id = 10;
      const action = deleteRowDataItem({ id });

      expect(action).toEqual({
        id,
        type: '[Create Case] Delete Item from Customer Table',
      });
    });
  });

  describe('createCase Actions', () => {
    test('createCase', () => {
      const action = createCase();

      expect(action).toEqual({
        type: '[Create Case] CreateCase from table and selected customer',
      });
    });

    test('createCaseSuccess', () => {
      const createdCase: CreateCaseResponse = {
        customerId: '1',
        gqId: 2,
        salesOrg: '3',
      };
      const action = createCaseSuccess({ createdCase });

      expect(action).toEqual({
        createdCase,
        type: '[Create Case] CreateCase from table and selected customer Success',
      });
    });

    test('createCaseFailure', () => {
      const errorMessage = 'Hello i am an error';
      const action = createCaseFailure({ errorMessage });

      expect(action).toEqual({
        errorMessage,
        type: '[Create Case] CreateCase from table and selected customer Failure',
      });
    });
  });

  describe('create ogp case actions', () => {
    test('createOgpCase', () => {
      const createCaseData = {
        customer: {
          customerId: '1234',
          salesOrg: '256',
        },
        shipToParty: {
          customerId: '1234',
          salesOrg: '256',
        },
        bindingPeriodValidityEndDate: '2021-08-01T00:00:00.000Z',
        caseName: 'caseName',
        customCurrency: 'USD',
        customerInquiryDate: '2021-08-01T00:00:00.000Z',
        offerTypeId: 1,
        quotationToDate: '2021-08-01T00:00:00.000Z',
        quotationToManualInput: false,
        partnerRoleId: 'partnerRoleId',
        purchaseOrderTypeId: 'purchaseOrderTypeId',
        requestedDeliveryDate: '2021-08-01T00:00:00.000Z',
      } as CreateCaseHeaderData;
      const action = createOgpCase({ createCaseData });

      expect(action).toEqual({
        createCaseData,
        type: '[Create Case] Create OGP Case',
      });
    });

    test('createOgpCaseSuccess', () => {
      const createdCase: CreateCaseResponse = {
        customerId: '1',
        gqId: 2,
        salesOrg: '3',
      };
      const action = createOgpCaseSuccess({ createdCase });

      expect(action).toEqual({
        createdCase,
        type: '[Create Case] Create OGP Case Success',
      });
    });

    test('createOgpCaseFailure', () => {
      const errorMessage = 'Hello i am an error';
      const action = createOgpCaseFailure({ errorMessage });

      expect(action).toEqual({
        errorMessage,
        type: '[Create Case] Create OGP Case Failure',
      });
    });
  });
  describe('importCase Actions', () => {
    test('importCase', () => {
      const action = importCase();

      expect(action).toEqual({
        type: '[Create Case] Import SAP Quotation',
      });
    });

    test('importCaseSuccess', () => {
      const gqId = 1_234_547;

      const action = importCaseSuccess({ gqId });

      expect(action).toEqual({
        gqId,
        type: '[Create Case] Import SAP Quotation Success',
      });
    });

    test('importCaseFailure', () => {
      const errorMessage = 'Hello i am an error';
      const action = importCaseFailure({ errorMessage });

      expect(action).toEqual({
        errorMessage,
        type: '[Create Case] Import SAP Quotation Failure',
      });
    });
  });

  describe('getSalesOrgs Actions', () => {
    test('getSalesOrgsSuccess', () => {
      const salesOrgs = [new SalesOrg('id', true)];
      const action = getSalesOrgsSuccess({ salesOrgs });

      expect(action).toEqual({
        salesOrgs,
        type: '[Create Case] Get Sales Organisations For Customer Success',
      });
    });
    test('getSalesOrgsFailure', () => {
      const errorMessage = 'This is an error';
      const action = getSalesOrgsFailure({ errorMessage });

      expect(action).toEqual({
        errorMessage,
        type: '[Create Case] Get Sales Organisations For Customer Failure',
      });
    });
  });
  describe('selectSalesOrg', () => {
    test('selectSalesOrg', () => {
      const salesOrgId = '1234';
      const action = selectSalesOrg({ salesOrgId });

      expect(action).toEqual({
        salesOrgId,
        type: '[Create Case] Select Sales Organisation For Customer',
      });
    });
  });
  describe('clearCustomer', () => {
    test('clearCustomer', () => {
      const action = clearCustomer();

      expect(action).toEqual({ type: '[Create Case] Clear Customer' });
    });
  });
  describe('getPLsAndSeries', () => {
    test('getPLsAndSeries', () => {
      const customerFilters: PLsSeriesRequest = {
        customer: {
          customerId: '1234',
          salesOrg: '256',
        },
        includeQuotationHistory: true,
        salesIndications: [SalesIndication.INVOICE],
        historicalDataLimitInYear: 2,
      };
      const action = getPLsAndSeries({ customerFilters });

      expect(action).toEqual({
        customerFilters,
        type: '[Create Case] Get Product lines and Series',
      });
    });
  });
  describe('getPLsAndSeriesSuccess', () => {
    test('getPLsAndSeriesSuccess', () => {
      const plsAndSeries: PLsAndSeries = {
        pls: [
          { value: '10', name: 'name', selected: false, series: ['NU', 'NJ'] },
        ],
        series: [
          {
            selected: false,
            value: 'NU',
          },
        ],
        gpsdGroupIds: [{ selected: false, value: 'F02' }],
      };

      const action = getPLsAndSeriesSuccess({ plsAndSeries });

      expect(action).toEqual({
        plsAndSeries,
        type: '[Create Case] Get Product lines and Series Success',
      });
    });
  });
  describe('getPLsAndSeriesFailure', () => {
    test('getPLsAndSeriesFailure', () => {
      const errorMessage = 'This is an error';

      const action = getPLsAndSeriesFailure({ errorMessage });

      expect(action).toEqual({
        errorMessage,
        type: '[Create Case] Get Product lines and Series Failure',
      });
    });
  });
  describe('setSelectedProductLines', () => {
    test('setSelectedProductLines', () => {
      const selectedProductLines = ['1'];
      const action = setSelectedProductLines({ selectedProductLines });

      expect(action).toEqual({
        selectedProductLines,
        type: '[Create Case] Set Selected Product Lines',
      });
    });
  });
  describe('setSelectedSeries', () => {
    test('setSelectedSeries', () => {
      const selectedSeries = ['1'];
      const action = setSelectedSeries({ selectedSeries });

      expect(action).toEqual({
        selectedSeries,
        type: '[Create Case] Set Selected Series',
      });
    });
  });
  describe('setSelectedGpsdGroups', () => {
    test('setSelectedGpsdGroups', () => {
      const selectedGpsdGroups = ['1'];
      const action = setSelectedGpsdGroups({ selectedGpsdGroups });

      expect(action).toEqual({
        selectedGpsdGroups,
        type: '[Create Case] Set Selected GPSD Groups',
      });
    });
  });
  describe('resetProductLineAndSeries', () => {
    test('resetProductLineAndSeries', () => {
      const action = resetProductLineAndSeries();

      expect(action).toEqual({
        type: '[Create Case] Reset ProductLineAndSeries',
      });
    });
  });
  describe('createCustomerCase', () => {
    test('createCustomerCase', () => {
      const action = createCustomerCase();

      expect(action).toEqual({
        type: '[Create Case] Create Customer Case',
      });
    });
  });
  describe('createCustomerCaseSuccess', () => {
    test('createCustomerCaseSuccess', () => {
      const action = createCustomerCaseSuccess();

      expect(action).toEqual({
        type: '[Create Case] Create Customer Case Success',
      });
    });
  });
  describe('createCustomerCaseFailure', () => {
    test('createCustomerCaseFailure', () => {
      const errorMessage = 'errorMessage';
      const action = createCustomerCaseFailure({ errorMessage });

      expect(action).toEqual({
        errorMessage,
        type: '[Create Case] Create Customer Case Failure',
      });
    });
  });

  describe('createCustomerOgpCase', () => {
    test('createCustomerOgpCase', () => {
      const createCaseData = {
        customerId: '1234',
        salesOrg: '256',
      } as unknown as CreateCaseHeaderData;
      const action = createCustomerOgpCase({ createCaseData });

      expect(action).toEqual({
        createCaseData,
        type: '[Create Case] Create Customer OGP Case',
      });
    });

    test('createCustomerOgpCaseSuccess', () => {
      const action = createCustomerOgpCaseSuccess({ createdCase: undefined });

      expect(action).toEqual({
        type: '[Create Case] Create Customer OGP Case Success',
      });
    });

    test('createCustomerOgpCaseFailure', () => {
      const errorMessage = 'errorMessage';
      const action = createCustomerOgpCaseFailure({ errorMessage });

      expect(action).toEqual({
        errorMessage,
        type: '[Create Case] Create Customer OGP Case Failure',
      });
    });
  });
  describe('resetCustomerFilter', () => {
    test('resetCustomerFilter', () => {
      const action = resetCustomerFilter();

      expect(action).toEqual({
        type: '[Create Case] Reset Autocomplete Customer',
      });
    });
  });
  describe('resetPLsAndSeries', () => {
    test('resetPLsAndSeries', () => {
      const action = resetPLsAndSeries();

      expect(action).toEqual({
        type: '[Create Case] Reset PLs and Series',
      });
    });
  });
  describe('resetAllAutocompleteOptions', () => {
    test('resetAllAutocompleteOptions', () => {
      const action = resetAllAutocompleteOptions();

      expect(action).toEqual({
        type: '[Create Case] Reset all autocomplete options',
      });
    });
  });
  describe('resetAutocompleteMaterials', () => {
    test('resetAutocompleteMaterials', () => {
      const action = resetAutocompleteMaterials();

      expect(action).toEqual({
        type: '[Create Case] Reset all autocomplete material options',
      });
    });
  });

  describe('validateMaterials', () => {
    test('should call validateMaterialsOnCustomerAndSalesOrg', () => {
      const action = validateMaterialsOnCustomerAndSalesOrg();

      expect(action).toEqual({
        type: '[Create Case] Validate for RowData Materials on Customer and SalesOrg',
      });
    });

    test('should call validateMaterialsOnCustomerAndSalesOrgSuccess', () => {
      const materialValidations: any[] = [];
      const action = validateMaterialsOnCustomerAndSalesOrgSuccess({
        materialValidations,
        isNewCaseCreation: false,
      });

      expect(action).toEqual({
        materialValidations,
        isNewCaseCreation: false,
        type: '[Create Case] Get Validation for RowData on Customer and SalesOrg: Validation Success',
      });
    });

    test('should call validateMaterialsOnCustomerAndSalesOrgFailure', () => {
      const action = validateMaterialsOnCustomerAndSalesOrgFailure();

      expect(action).toEqual({
        type: '[Create Case] Get Validation for RowData on Customer and SalesOrg: Validation Failure',
      });
    });

    test('should call setRowDataCurrency', () => {
      const currency = 'USD';
      const action = setRowDataCurrency({ currency });

      expect(action).toEqual({
        currency,
        type: '[Create Case] Set RowData Currency',
      });
    });
    test('should call updateCurrencyOfPositionItems', () => {
      const action = updateCurrencyOfPositionItems();

      expect(action).toEqual({
        type: '[Create Case] Update Currency of Position Items',
      });
    });
  });
});
