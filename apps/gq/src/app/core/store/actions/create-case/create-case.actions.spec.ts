import { AutocompleteSearch, IdValue } from '../../models';
import {
  autocomplete,
  autocompleteCustomerSuccess,
  autocompleteFailure,
  autocompleteQuotationSuccess,
} from './create-case.actions';

describe('Create Actions', () => {
  describe('Autocomplete Actions', () => {
    test('autocomplete', () => {
      const autocompleteSearch = new AutocompleteSearch('customer', 'Awe');

      const action = autocomplete({ autocompleteSearch });

      expect(action).toEqual({
        autocompleteSearch,
        type:
          '[Create Case] Get Autocomplete Suggestions For Customer or Quotation',
      });
    });

    test('autocompleteFailure', () => {
      const action = autocompleteFailure();

      expect(action).toEqual({
        type:
          '[Create Case] Get Autocomplete Suggestions For Provided Customer or Quotation Failure',
      });
    });

    test('autocompleteCustomerSuccess', () => {
      const options = [new IdValue('23', 'Test Customer', true)];

      const action = autocompleteCustomerSuccess({ options });

      expect(action).toEqual({
        options,
        type: '[Create Case] Get Autocomplete Suggestions For Customer Success',
      });
    });

    test('autocompleteQuotationSuccess', () => {
      const options = [new IdValue('23', 'Test Customer', true)];

      const action = autocompleteQuotationSuccess({ options });

      expect(action).toEqual({
        options,
        type:
          '[Create Case] Get Autocomplete Suggestions For Quotation Success',
      });
    });
  });
});
