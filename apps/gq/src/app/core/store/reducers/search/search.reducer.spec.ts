import { Action } from '@ngrx/store';

import { APP_STATE_MOCK } from '../../../../../testing/mocks/app-state.mock';
import {
  autocomplete,
  autocompleteFailure,
  autocompleteSuccess,
  updateFilter,
} from '../../actions';
import { FilterItem, IdValue } from '../../models';
import { initialState, reducer, searchReducer } from './search.reducer';

describe('Search Reducer', () => {
  describe('autocomplete', () => {
    test('should set autocomplete loading', () => {
      const action = autocomplete({
        textSearch: APP_STATE_MOCK.textSearch,
      });
      const state = searchReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        filters: { ...initialState.filters, autocompleteLoading: true },
      });
    });
  });

  describe('autocompleteSuccess', () => {
    test('should upsert possible filters', () => {
      const action = autocompleteSuccess({ item: APP_STATE_MOCK.item });
      const state = searchReducer(initialState, action);

      expect(state.filters.items.entities.customer.filter).toEqual(
        APP_STATE_MOCK.item.filter
      );
      expect(state.filters.items.entities.customer.options).toEqual(
        APP_STATE_MOCK.item.options
      );
    });
  });

  describe('autocompleteFailure', () => {
    test('should not manipulate state', () => {
      const action = autocompleteFailure();
      const state = searchReducer(initialState, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('updateFilter', () => {
    test('should udate filter', () => {
      const action = updateFilter({ item: APP_STATE_MOCK.item });
      const state = searchReducer(initialState, action);

      expect(state.filters.items.entities.customer.filter).toBe(
        APP_STATE_MOCK.item.filter
      );
      expect(state.filters.items.entities.customer.options).toEqual(
        APP_STATE_MOCK.item.options
      );
    });
  });
  describe('sortFilterItem', () => {
    test('should revert array', () => {
      const filterItem = new FilterItem('customer', [
        new IdValue('23', 'The customer', false),
        new IdValue('24', 'The customer', true),
      ]);

      const action = updateFilter({ item: filterItem });
      const state = searchReducer(initialState, action);

      expect(state.filters.items.entities.customer.filter).toEqual(
        filterItem.filter
      );
      expect(state.filters.items.entities.customer.options).toEqual(
        filterItem.options.reverse()
      );
    });
    test('should not revert array', () => {
      const filterItem = new FilterItem('customer', [
        new IdValue('23', 'The customer', true),
        new IdValue('24', 'The customer', false),
      ]);

      const action = updateFilter({ item: filterItem });
      const state = searchReducer(initialState, action);

      expect(state.filters.items.entities.customer.filter).toEqual(
        filterItem.filter
      );
      expect(state.filters.items.entities.customer.options).toEqual(
        filterItem.options
      );
    });
    test('should not revert array 2', () => {
      const filterItem = new FilterItem('customer', [
        new IdValue('23', 'The customer', true),
        new IdValue('24', 'The customer', true),
      ]);

      const action = updateFilter({ item: filterItem });
      const state = searchReducer(initialState, action);

      expect(state.filters.items.entities.customer.filter).toEqual(
        filterItem.filter
      );
      expect(state.filters.items.entities.customer.options).toEqual(
        filterItem.options
      );
    });
  });
  describe('Reducer function', () => {
    test('should return searchReducer', () => {
      // prepare any action
      const action: Action = autocompleteFailure();
      expect(reducer(initialState, action)).toEqual(
        searchReducer(initialState, action)
      );
    });
  });
});
