import { FilterItem } from '../../models/filter-item.model';
import { IdValue } from '../../models/id-value.model';
import { TextSearch } from '../../models/text-search.model';
import {
  autocomplete,
  autocompleteFailure,
  autocompleteSuccess,
  updateFilter,
} from './search.actions';

describe('Search Actions', () => {
  describe('Autocomplete Actions', () => {
    test('updateFilter', () => {
      const item = new FilterItem('customer', [
        new IdValue('20', 'Test Customer', true),
      ]);

      const action = updateFilter({ item });

      expect(action).toEqual({
        item,
        type: '[Search] Update Filter',
      });
    });

    test('autocomplete', () => {
      const textSearch = new TextSearch('customer', 'Awe');

      const action = autocomplete({ textSearch });

      expect(action).toEqual({
        textSearch,
        type: '[Search] Get Autocomplete Suggestions For Provided Filter Type',
      });
    });

    test('autocompleteSuccess', () => {
      const item = new FilterItem('customer', [
        new IdValue('23', 'Test Customer', true),
      ]);

      const action = autocompleteSuccess({ item });

      expect(action).toEqual({
        item,
        type:
          '[Search] Get Autocomplete Suggestions For Provided Filter Type Success',
      });
    });

    test('autocompleteFailure', () => {
      const action = autocompleteFailure();

      expect(action).toEqual({
        type:
          '[Search] Get Autocomplete Suggestions For Provided Filter Type Failure',
      });
    });
  });
});
