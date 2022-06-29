import { FilterNames } from '../../../../shared/components/autocomplete-input/filter-names.enum';
import { AutocompleteSearch, IdValue } from '../../../../shared/models/search';
import { ValidationDescription } from '../../../../shared/models/table';
import { PLsSeriesRequest } from '../../../../shared/services/rest-services/search-service/models/pls-series-request.model';
import {
  CreateCaseResponse,
  SalesOrg,
} from '../../reducers/create-case/models';
import { PLsAndSeries } from '../../reducers/create-case/models/pls-and-series.model';
import { SalesIndication } from '../../reducers/transactions/models/sales-indication.enum';
import {
  addRowDataItem,
  autocomplete,
  autocompleteFailure,
  autocompleteSuccess,
  clearCreateCaseRowData,
  createCase,
  createCaseFailure,
  createCaseSuccess,
  createCustomerCase,
  createCustomerCaseFailure,
  createCustomerCaseSuccess,
  deleteRowDataItem,
  getPLsAndSeries,
  getPLsAndSeriesFailure,
  getPLsAndSeriesSuccess,
  getSalesOrgsFailure,
  getSalesOrgsSuccess,
  importCase,
  importCaseFailure,
  importCaseSuccess,
  pasteRowDataItems,
  resetCustomerFilter,
  resetPLsAndSeries,
  resetProductLineAndSeries,
  selectAutocompleteOption,
  selectSalesOrg,
  setSelectedAutocompleteOption,
  setSelectedProductLines,
  setSelectedSeries,
  unselectAutocompleteOptions,
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
        type: '[Create Case] Get Autocomplete Suggestions For selected Autocomplete Option',
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

      const action = addRowDataItem({ items });

      expect(action).toEqual({
        items,
        type: '[Create Case] Add new Items to Customer Table',
      });
    });
    test('pasteRowDataItems', () => {
      const items = [
        {
          materialNumber: '1234',
          quantity: 105,
          info: { valid: true, description: [ValidationDescription.Valid] },
        },
      ];
      const action = pasteRowDataItems({ items });

      expect(action).toEqual({
        items,
        type: '[Create Case] Paste new Items to Customer Table',
      });
    });

    test('clearRowData', () => {
      const action = clearCreateCaseRowData();

      expect(action).toEqual({
        type: '[Create Case] Clear RowData',
      });
    });

    test('deleteRowDataItem', () => {
      const materialNumber = '12132';
      const quantity = 10;
      const action = deleteRowDataItem({ materialNumber, quantity });

      expect(action).toEqual({
        materialNumber,
        quantity,
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
});
