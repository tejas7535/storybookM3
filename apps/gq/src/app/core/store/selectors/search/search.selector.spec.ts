import { FilterItem, IdValue } from '../../models';
import { initialState } from '../../reducers/search/search.reducer';
import {
  getAutocompleteLoading,
  getFilters,
  getFiltersEntityState,
} from './search.selectors';

describe('Search Selector', () => {
  const fakeState = {
    search: {
      ...initialState,
      filters: {
        ...initialState.filters,
        autocompleteLoading: true,
        searchText: {
          field: 'customer',
          value: 'aud',
        },
      },
    },
  };

  describe('getFiltersEntityState', () => {
    it('should return true if autocomplete is currently loading', () => {
      expect(getFiltersEntityState(fakeState)).toBeTruthy();
    });
  });

  describe('getFilters', () => {
    test('should return all filters', () => {
      const customer = new FilterItem('customer', [
        new IdValue('vw', 'VW', false),
        new IdValue('vw2', 'VW 2', false),
        new IdValue('vw3', 'VW 3', false),
      ]);
      const items = [customer];

      const entityState = {
        ids: ['customer'],
        entities: {
          customer,
        },
      };

      expect(getFilters.projector(entityState)).toEqual(items);
    });
  });

  describe('getAutocompleteLoading', () => {
    test('should return true if autocomplete is currently loading', () => {
      expect(getAutocompleteLoading(fakeState)).toBeTruthy();
    });
  });
});
