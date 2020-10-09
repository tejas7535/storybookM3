import { AutocompleteSearch, QueryItem } from '../../models';
import { IdValue } from '../../models/id-value.model';
import {
  addOption,
  autocompleteDepr,
  autocompleteFailureDepr,
  autocompleteSuccessDepr,
  createQueries,
  removeOption,
  removeQueryItem,
  selectedFilterChange,
} from './search.actions';

describe('Search Actions', () => {
  describe('Autocomplete Actions', () => {
    test('autocomplete', () => {
      const autocompleteSearch = new AutocompleteSearch('customer', 'Awe');

      const action = autocompleteDepr({ autocompleteSearch });

      expect(action).toEqual({
        autocompleteSearch,
        type: '[Search] Get Autocomplete Suggestions For Provided Filter Type',
      });
    });

    test('autocompleteSuccess', () => {
      const filter = 'customer';
      const options = [new IdValue('23', 'Test Customer', true)];

      const action = autocompleteSuccessDepr({ filter, options });

      expect(action).toEqual({
        filter,
        options,
        type:
          '[Search] Get Autocomplete Suggestions For Provided Filter Type Success',
      });
    });

    test('autocompleteFailure', () => {
      const action = autocompleteFailureDepr();

      expect(action).toEqual({
        type:
          '[Search] Get Autocomplete Suggestions For Provided Filter Type Failure',
      });
    });

    test('selectedFilterChange', () => {
      const filterName = 'customer';
      const action = selectedFilterChange({ filterName });

      expect(action).toEqual({
        filterName,
        type: '[Search] Update Selected Input For Selection Change',
      });
    });

    test('addOption', () => {
      const option = new IdValue('customer', 'customer', true);
      const filterName = 'Audi123';
      const action = addOption({ option, filterName });

      expect(action).toEqual({
        option,
        filterName,
        type: '[Search] Add Option For Filter',
      });
    });

    test('removeOption', () => {
      const option = new IdValue('customer', 'customer', true);
      const filterName = 'Audi123';
      const action = removeOption({ option, filterName });

      expect(action).toEqual({
        option,
        filterName,
        type: '[Search] Remove Action Of Filter',
      });
    });

    test('createQueries', () => {
      const action = createQueries();

      expect(action).toEqual({
        type: '[Search] Create Queries For Filter',
      });
    });

    test('removeQueryItem', () => {
      const queryItem = new QueryItem('audi', '234', '10');
      const action = removeQueryItem({ queryItem });

      expect(action).toEqual({
        queryItem,
        type: '[Search] Remove Query Item',
      });
    });
  });
});
