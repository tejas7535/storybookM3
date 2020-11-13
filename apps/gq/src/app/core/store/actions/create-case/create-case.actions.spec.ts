import {
  AutocompleteSearch,
  CaseTableItem,
  IdValue,
  ValidationDescription,
} from '../../models';
import {
  addRowDataItem,
  autocomplete,
  autocompleteFailure,
  autocompleteSuccess,
  clearRowData,
  deleteRowDataItem,
  importCase,
  importCaseFailure,
  importCaseSuccess,
  pasteRowDataItems,
  selectAutocompleteOption,
  unselectAutocompleteOptions,
} from './create-case.actions';

describe('Create Actions', () => {
  describe('Autocomplete Actions', () => {
    test('autocomplete', () => {
      const autocompleteSearch = new AutocompleteSearch('customer', 'Awe');

      const action = autocomplete({ autocompleteSearch });

      expect(action).toEqual({
        autocompleteSearch,
        type:
          '[Create Case] Get Autocomplete Suggestions For Autocomplete Option',
      });
    });

    test('autocompleteFailure', () => {
      const action = autocompleteFailure();

      expect(action).toEqual({
        type:
          '[Create Case] Get Autocomplete Suggestions For Autocomplete Option Failure',
      });
    });

    test('autocompleteSuccess', () => {
      const options = [new IdValue('23', 'Test Customer', true)];
      const filter = 'customer';
      const action = autocompleteSuccess({ options, filter });

      expect(action).toEqual({
        options,
        filter,
        type:
          '[Create Case] Get Autocomplete Suggestions For selected Autocomplete Option',
      });
    });

    test('selectAutocompleteOption', () => {
      const option = new IdValue('23', 'Test Customer', true);
      const filter = 'customer';
      const action = selectAutocompleteOption({ option, filter });

      expect(action).toEqual({
        option,
        filter,
        type: '[Create Case] Select Option for selected Autocomplete Option',
      });
    });

    test('unselectAutocompleteOption', () => {
      const filter = 'customer';
      const action = unselectAutocompleteOptions({ filter });

      expect(action).toEqual({
        filter,
        type: '[Create Case] Unselect Options for selected Autocomplete Option',
      });
    });

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
      const pasteDestination: CaseTableItem = {
        materialNumber: '12321',
        quantity: 123,
        info: { valid: true, description: [ValidationDescription.Valid] },
      };
      const action = pasteRowDataItems({ items, pasteDestination });

      expect(action).toEqual({
        items,
        pasteDestination,
        type: '[Create Case] Paste new Items to Customer Table',
      });
    });

    test('clearRowData', () => {
      const action = clearRowData();

      expect(action).toEqual({
        type: '[Create Case] Clear RowData',
      });
    });

    test('deleteRowDataItem', () => {
      const materialNumber = '12132';

      const action = deleteRowDataItem({ materialNumber });

      expect(action).toEqual({
        materialNumber,
        type: '[Create Case] Delete Item from Customer Table',
      });
    });

    test('importCase', () => {
      const action = importCase();

      expect(action).toEqual({
        type: '[Create Case] Import SAP Quotation',
      });
    });

    test('importCaseSuccess', () => {
      const quotationNumber = '1234547';

      const action = importCaseSuccess({ quotationNumber });

      expect(action).toEqual({
        quotationNumber,
        type: '[Create Case] Import SAP Quotation Success',
      });
    });

    test('importCase', () => {
      const action = importCaseFailure();

      expect(action).toEqual({
        type: '[Create Case] Import SAP Quotation Failure',
      });
    });
  });
});
