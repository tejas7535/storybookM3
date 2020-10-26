import { Action } from '@ngrx/store';

import { CREATE_CASE_STORE_STATE_MOCK } from '../../../../../testing/mocks';
import {
  addRowDataItem,
  autocomplete,
  autocompleteFailure,
  autocompleteSuccess,
  clearRowData,
  deleteRowDataItem,
  selectAutocompleteOption,
  unselectAutocompleteOptions,
} from '../../actions';
import { AutocompleteSearch, IdValue } from '../../models';
import { CaseState, createCaseReducer, reducer } from './create-case.reducer';

describe('Create Case Reducer', () => {
  describe('autocomplete', () => {
    test('should set autocomplete loading', () => {
      const autocompleteSearch = new AutocompleteSearch('customer', 'Audi');
      const action = autocomplete({ autocompleteSearch });
      const state = createCaseReducer(CREATE_CASE_STORE_STATE_MOCK, action);

      expect(state).toEqual({
        ...CREATE_CASE_STORE_STATE_MOCK,
        createCase: {
          ...CREATE_CASE_STORE_STATE_MOCK.createCase,
          autocompleteLoading: 'customer',
        },
      });
    });
  });

  describe('autocompleteSuccess', () => {
    test('should merge options', () => {
      const autoCompleteOptions = [new IdValue('mcd', 'mercedes', false)];

      const fakeOptions = [
        new IdValue('mcd', 'mercedes', true),
        new IdValue('aud', 'audi', false),
      ];

      const fakeState: CaseState = {
        createCase: {
          ...CREATE_CASE_STORE_STATE_MOCK.createCase,
          autocompleteLoading: 'customer',
          autocompleteItems: [{ filter: 'customer', options: fakeOptions }],
        },
      };

      const action = autocompleteSuccess({
        options: autoCompleteOptions,
        filter: 'customer',
      });

      const state = createCaseReducer(fakeState, action);

      const stateItem = state.createCase.autocompleteItems[0].options;
      expect(stateItem).toEqual([fakeOptions[0]]);
    });
  });

  describe('autocompleteFailure', () => {
    test('should not manipulate state', () => {
      const action = autocompleteFailure();
      const state = createCaseReducer(CREATE_CASE_STORE_STATE_MOCK, action);

      expect(state).toEqual(CREATE_CASE_STORE_STATE_MOCK);
    });
  });
  describe('selectAutocompleteOptions', () => {
    test('should set customer option selected true', () => {
      const fakeOptions = [
        new IdValue('mcd', 'mercedes', false),
        new IdValue('aud', 'audi', false),
      ];
      const selectOption = new IdValue('mcd', 'mercedes', true);
      const fakeState: CaseState = {
        createCase: {
          ...CREATE_CASE_STORE_STATE_MOCK.createCase,
          autocompleteLoading: 'customer',
          autocompleteItems: [
            {
              filter: 'customer',
              options: fakeOptions,
            },
          ],
        },
      };

      const action = selectAutocompleteOption({
        option: selectOption,
        filter: 'customer',
      });

      const state = createCaseReducer(fakeState, action);

      const stateItem = state.createCase.autocompleteItems[0].options;
      expect(stateItem).toEqual([selectOption, fakeOptions[1]]);
    });
  });

  describe('unselectAutocompleteOptions', () => {
    test('should unslecet customer options', () => {
      const fakeOptions = [
        new IdValue('mcd', 'mercedes', true),
        new IdValue('aud', 'audi', false),
      ];
      const fakeState: CaseState = {
        createCase: {
          ...CREATE_CASE_STORE_STATE_MOCK.createCase,
          autocompleteLoading: 'customer',
          autocompleteItems: [
            {
              filter: 'customer',
              options: fakeOptions,
            },
          ],
        },
      };

      const action = unselectAutocompleteOptions({
        filter: 'customer',
      });

      const state = createCaseReducer(fakeState, action);

      const stateItem = state.createCase.autocompleteItems[0].options;
      expect(stateItem).toEqual([
        { ...fakeOptions[0], selected: false },
        fakeOptions[1],
      ]);
    });
  });

  describe('addRowDataItem', () => {
    test('should addItem to Row Data', () => {
      const fakeData = [
        {
          materialNumber: '123',
          quantity: 10,
          info: true,
        },
      ];
      const items = [
        {
          materialNumber: '1234',
          quantity: 105,
          info: true,
        },
      ];
      const fakeState: CaseState = {
        createCase: {
          ...CREATE_CASE_STORE_STATE_MOCK.createCase,
          rowData: fakeData,
        },
      };

      const action = addRowDataItem({ items });

      const state = createCaseReducer(fakeState, action);

      const stateItem = state.createCase.rowData;
      expect(stateItem).toEqual([...items, ...fakeData]);
    });
  });
  describe('clearRowData', () => {
    test('should clear Row Data', () => {
      const fakeData = [
        {
          materialNumber: '123',
          quantity: 10,
          info: true,
        },
      ];

      const fakeState: CaseState = {
        createCase: {
          ...CREATE_CASE_STORE_STATE_MOCK.createCase,
          rowData: fakeData,
        },
      };

      const action = clearRowData();

      const state = createCaseReducer(fakeState, action);

      const stateItem = state.createCase.rowData;
      expect(stateItem).toEqual([]);
    });
  });

  describe('deleteRowDataItem', () => {
    test('should delete Item from Rowdata', () => {
      const materialNumberDelete = '1234';
      const fakeData = [
        {
          materialNumber: '123',
          quantity: 10,
          info: true,
        },
        {
          materialNumber: materialNumberDelete,
          quantity: 10,
          info: true,
        },
      ];

      const fakeState: CaseState = {
        createCase: {
          ...CREATE_CASE_STORE_STATE_MOCK.createCase,
          rowData: fakeData,
        },
      };

      const action = deleteRowDataItem({
        materialNumber: materialNumberDelete,
      });

      const state = createCaseReducer(fakeState, action);

      const stateItem = state.createCase.rowData;
      expect(stateItem).toEqual([fakeData[0]]);
    });
  });

  describe('Reducer function', () => {
    test('should return searchReducer', () => {
      // prepare any action
      const action: Action = autocompleteFailure();
      expect(reducer(CREATE_CASE_STORE_STATE_MOCK, action)).toEqual(
        createCaseReducer(CREATE_CASE_STORE_STATE_MOCK, action)
      );
    });
  });
});
