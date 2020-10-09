import { Action } from '@ngrx/store';

import { CREATE_CASE_MOCK } from '../../../../../testing/mocks/create-case-state.mock';
import {
  autocomplete,
  autocompleteCustomerSuccess,
  autocompleteFailure,
} from '../../actions';
import { AutocompleteSearch, IdValue } from '../../models';
import { createCaseReducer, reducer } from './create-case.reducer';

describe('Create Case Reducer', () => {
  describe('autocomplete', () => {
    test('should set autocomplete loading', () => {
      const autocompleteSearch = new AutocompleteSearch('customer', 'Audi');
      const action = autocomplete({ autocompleteSearch });
      const state = createCaseReducer(CREATE_CASE_MOCK, action);

      expect(state).toEqual({
        ...CREATE_CASE_MOCK,
        createCase: {
          ...CREATE_CASE_MOCK.createCase,
          autocompleteLoading: 'customer',
        },
      });
    });
  });

  describe('autocompleteCustomerSuccess', () => {
    test('should upsert possible filters', () => {
      const autoCompleteOptions = [new IdValue('mcd', 'mercedes', false)];

      const fakeOptions = [
        new IdValue('mcd', 'mercedes', true),
        new IdValue('aud', 'audi', false),
      ];

      const fakeState = {
        createCase: {
          ...CREATE_CASE_MOCK.createCase,
          autocompleteLoading: 'customer',
          customer: {
            ...CREATE_CASE_MOCK.createCase.customer,
            options: fakeOptions,
          },
        },
      };

      const action = autocompleteCustomerSuccess({
        options: autoCompleteOptions,
      });

      const state = createCaseReducer(fakeState, action);

      const stateItem = state.createCase.customer.options;
      expect(stateItem).toEqual([fakeOptions[0]]);
    });
  });

  describe('autocompleteFailure', () => {
    test('should not manipulate state', () => {
      const action = autocompleteFailure();
      const state = createCaseReducer(CREATE_CASE_MOCK, action);

      expect(state).toEqual(CREATE_CASE_MOCK);
    });
  });
  describe('Reducer function', () => {
    test('should return searchReducer', () => {
      // prepare any action
      const action: Action = autocompleteFailure();
      expect(reducer(CREATE_CASE_MOCK, action)).toEqual(
        createCaseReducer(CREATE_CASE_MOCK, action)
      );
    });
  });
});
