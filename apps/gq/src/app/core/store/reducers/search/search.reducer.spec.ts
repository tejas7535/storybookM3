import { Action } from '@ngrx/store';

import { APP_STATE_MOCK } from '../../../../../testing/mocks/app-state.mock';
import {
  addOption,
  autocomplete,
  autocompleteFailure,
  autocompleteSuccess,
  createQueries,
  removeOption,
  removeQueryItem,
  selectedFilterChange,
} from '../../actions';
import {
  AutocompleteSearch,
  FilterItem,
  IdValue,
  QueryItem,
} from '../../models';
import { reducer, searchReducer, SearchState } from './search.reducer';

describe('Search Reducer', () => {
  describe('autocomplete', () => {
    test('should set autocomplete loading', () => {
      const autocompleteSearch = new AutocompleteSearch('customer', 'Audi');
      const action = autocomplete({ autocompleteSearch });
      const state = searchReducer(APP_STATE_MOCK, action);

      expect(state).toEqual({
        ...APP_STATE_MOCK,
        filters: {
          ...APP_STATE_MOCK.filters,
          autocompleteLoading: autocompleteSearch.filter,
        },
      });
    });
  });

  describe('autocompleteSuccess', () => {
    test('should upsert possible filters', () => {
      const item = new FilterItem(
        'customer',
        [new IdValue('mcd', 'mercedes', true)],
        true,
        ['customer'],
        true
      );
      const fakeOptions = [
        new IdValue('aud', 'audi', true),
        new IdValue('bm', 'bmw', false),
      ];

      const fakeState = {
        ...APP_STATE_MOCK,
        filters: {
          ...APP_STATE_MOCK.filters,
          items: [
            {
              filter: 'customer',
              options: fakeOptions,
              hasAutoComplete: false,
              optionalParents: [] as string[],
              multiSelect: true,
            },
          ],
        },
      };
      const action = autocompleteSuccess({
        filter: item.filter,
        options: item.options,
      });
      const state = searchReducer(fakeState, action);

      const stateItem = state.filters.items.find(
        (it) => it.filter === item.filter
      );
      const expected = [fakeOptions[0], item.options[0]];
      expect(stateItem.options).toEqual(expected);
    });
  });

  describe('autocompleteFailure', () => {
    test('should not manipulate state', () => {
      const action = autocompleteFailure();
      const state = searchReducer(APP_STATE_MOCK, action);

      expect(state).toEqual(APP_STATE_MOCK);
    });
  });

  describe('addOption', () => {
    test('should add option to filter', () => {
      const option = new IdValue('customer1', 'customer1', true);
      const filterName = 'customer';
      const action = addOption({ option, filterName });
      const state = searchReducer(APP_STATE_MOCK, action);

      expect(state.filters.items[0].options[0]).toEqual(option);
    });
    test('should not add already existing option', () => {
      const option = new IdValue('key', 'key', true);
      const filterName = 'keyAccount';
      const action = addOption({ option, filterName });
      const state = searchReducer(APP_STATE_MOCK, action);

      expect(state).toEqual(APP_STATE_MOCK);
      expect(state.filters.items[2].options[0].selected).toBeTruthy();
    });
  });

  describe('removeOption', () => {
    test('should remove option from filter', () => {
      const option = new IdValue('key', 'key', true);
      const filterName = 'keyAccount';
      const action = removeOption({ option, filterName });
      const state = searchReducer(APP_STATE_MOCK, action);
      expect(state.filters.items[2].options[0].selected).toBeFalsy();
    });
  });

  describe('selectedFilterChange', () => {
    test('should change selected Filter', () => {
      const filterName = 'keyAccount';
      const action = selectedFilterChange({ filterName });
      const state = searchReducer(APP_STATE_MOCK, action);

      expect(state.filters.selected).toEqual(filterName);
    });
  });

  describe('createQueries', () => {
    test('should create queries', () => {
      const expected = [new QueryItem('audi', '1500', '10')];
      const fakeState: SearchState = {
        ...APP_STATE_MOCK,
        filters: {
          ...APP_STATE_MOCK.filters,
          items: [
            {
              filter: 'customer',
              options: [new IdValue('audi', 'audi', true)],
              hasAutoComplete: false,
              optionalParents: [],
              multiSelect: true,
            },
            {
              filter: 'materialNumber',
              options: [{ id: '1500', value: '1500', selected: true }],
              hasAutoComplete: false,
              optionalParents: [],
              multiSelect: true,
            },
            {
              filter: 'quantity',
              options: [{ id: '10', value: '10', selected: true }],
              hasAutoComplete: false,
              optionalParents: [],
              multiSelect: true,
            },
          ],
        },
      };

      const action = createQueries();
      const state = searchReducer(fakeState, action);
      expect(state.queryList).toEqual(expected);
    });
  });

  describe('removeQueryItem', () => {
    test('should create queries', () => {
      const queryItem = new QueryItem('audi', '1450', '100');
      const fakeState: SearchState = {
        ...APP_STATE_MOCK,
        queryList: [queryItem],
      };

      const action = removeQueryItem({ queryItem });
      const state = searchReducer(fakeState, action);
      expect(state.queryList).toEqual([]);
    });
  });

  describe('Reducer function', () => {
    test('should return searchReducer', () => {
      // prepare any action
      const action: Action = autocompleteFailure();
      expect(reducer(APP_STATE_MOCK, action)).toEqual(
        searchReducer(APP_STATE_MOCK, action)
      );
    });
  });
});
