import { Action } from '@ngrx/store';

import { CREATE_CASE_STORE_STATE_MOCK } from '../../../../../testing/mocks';
import { FilterNames } from '../../../../shared/autocomplete-input/filter-names.enum';
import {
  addRowDataItem,
  autocomplete,
  autocompleteFailure,
  autocompleteSuccess,
  clearRowData,
  createCase,
  createCaseFailure,
  createCaseSuccess,
  deleteRowDataItem,
  getSalesOrgsFailure,
  getSalesOrgsSuccess,
  pasteRowDataItems,
  selectAutocompleteOption,
  unselectAutocompleteOptions,
  validateFailure,
  validateSuccess,
} from '../../actions';
import {
  AutocompleteSearch,
  CreateCaseResponse,
  IdValue,
  MaterialTableItem,
  MaterialValidation,
  SalesOrg,
  ValidationDescription,
} from '../../models';
import { dummyRowData } from './config/dummy-row-data';
import { CaseState, createCaseReducer, reducer } from './create-case.reducer';

describe('Create Case Reducer', () => {
  describe('autocomplete', () => {
    test('should set autocomplete loading', () => {
      const autocompleteSearch = new AutocompleteSearch(
        FilterNames.CUSTOMER,
        'Audi'
      );
      const action = autocomplete({ autocompleteSearch });
      const state = createCaseReducer(CREATE_CASE_STORE_STATE_MOCK, action);

      expect(state).toEqual({
        ...CREATE_CASE_STORE_STATE_MOCK,
        createCase: {
          ...CREATE_CASE_STORE_STATE_MOCK.createCase,
          autocompleteLoading: FilterNames.CUSTOMER,
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
          autocompleteLoading: FilterNames.CUSTOMER,
          autocompleteItems: [
            { filter: FilterNames.CUSTOMER, options: fakeOptions },
          ],
        },
      };

      const action = autocompleteSuccess({
        options: autoCompleteOptions,
        filter: FilterNames.CUSTOMER,
      });

      const state = createCaseReducer(fakeState, action);

      const stateItem = state.createCase.autocompleteItems[0].options;
      expect(stateItem).toEqual([fakeOptions[0]]);
    });
    test('should transform material numbers', () => {
      const autoCompleteOptions = [
        new IdValue('000000167000010', '1234', false),
      ];

      const fakeState: CaseState = {
        createCase: {
          ...CREATE_CASE_STORE_STATE_MOCK.createCase,
          autocompleteLoading: FilterNames.MATERIAL,
          autocompleteItems: [{ filter: FilterNames.MATERIAL, options: [] }],
        },
      };

      const action = autocompleteSuccess({
        options: autoCompleteOptions,
        filter: FilterNames.MATERIAL,
      });

      const state = createCaseReducer(fakeState, action);

      const stateItem = state.createCase.autocompleteItems[0].options[0].id;
      expect(stateItem).toEqual('000000167-0000-10');
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
          autocompleteLoading: FilterNames.CUSTOMER,
          autocompleteItems: [
            {
              filter: FilterNames.CUSTOMER,
              options: fakeOptions,
            },
          ],
        },
      };

      const action = selectAutocompleteOption({
        option: selectOption,
        filter: FilterNames.CUSTOMER,
      });

      const state = createCaseReducer(fakeState, action);

      const stateItem = state.createCase;
      expect(stateItem.autocompleteItems[0].options).toEqual([
        selectOption,
        fakeOptions[1],
      ]);
      expect(stateItem.customer.salesOrgsLoading).toBeTruthy();
      expect(stateItem.customer.customerId).toEqual(selectOption.id);
    });
  });
  describe('unselectAutocompleteOptions', () => {
    test('should unselect customer options', () => {
      const fakeOptions = [
        new IdValue('mcd', 'mercedes', true),
        new IdValue('aud', 'audi', false),
      ];
      const fakeState: CaseState = {
        createCase: {
          ...CREATE_CASE_STORE_STATE_MOCK.createCase,
          autocompleteLoading: FilterNames.CUSTOMER,
          autocompleteItems: [
            {
              filter: FilterNames.CUSTOMER,
              options: fakeOptions,
            },
          ],
        },
      };

      const action = unselectAutocompleteOptions({
        filter: FilterNames.CUSTOMER,
      });

      const state = createCaseReducer(fakeState, action);

      const stateItem = state.createCase;
      expect(stateItem.autocompleteItems[0].options).toEqual([
        { ...fakeOptions[0], selected: false },
        fakeOptions[1],
      ]);
      expect(stateItem.customer.salesOrgs).toEqual([]);
    });
  });
  describe('addRowDataItem', () => {
    test('should addItem to Row Data', () => {
      const fakeData = [
        dummyRowData,
        {
          materialNumber: '123',
          quantity: 10,
          info: { valid: true, description: [ValidationDescription.Valid] },
        },
      ];
      const items = [
        {
          materialNumber: '1234',
          quantity: 105,
          info: { valid: true, description: [ValidationDescription.Valid] },
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
      expect(stateItem).toEqual([...items, fakeData[1]]);
    });
  });
  describe('pasteRowDataItems', () => {
    test('should paste items in table', () => {
      const fakeData: MaterialTableItem[] = [
        {
          materialNumber: '123',
          quantity: 10,
          info: {
            valid: false,
            description: [ValidationDescription.MaterialNumberInValid],
          },
        },
      ];
      const items: MaterialTableItem[] = [
        {
          materialNumber: '1',
          quantity: 10,
          info: {
            valid: false,
            description: [ValidationDescription.MaterialNumberInValid],
          },
        },
        {
          materialNumber: '12',
          quantity: 10,
          info: {
            valid: false,
            description: [ValidationDescription.MaterialNumberInValid],
          },
        },
      ];
      const pasteDestination: MaterialTableItem = {
        materialNumber: '123',
        quantity: 10,
        info: {
          valid: false,
          description: [ValidationDescription.MaterialNumberInValid],
        },
      };
      const fakeState: CaseState = {
        createCase: {
          ...CREATE_CASE_STORE_STATE_MOCK.createCase,
          rowData: fakeData,
        },
      };

      const action = pasteRowDataItems({ items, pasteDestination });

      const state = createCaseReducer(fakeState, action);
      const stateItem = state.createCase.rowData;
      expect(stateItem).toEqual([...fakeData, ...items]);
    });
  });
  describe('clearRowData', () => {
    test('should clear Row Data', () => {
      const fakeData = [
        {
          materialNumber: '123',
          quantity: 10,
          info: { valid: true, description: [ValidationDescription.Valid] },
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
      expect(stateItem).toEqual([dummyRowData]);
    });
  });
  describe('deleteRowDataItem', () => {
    test('should delete Item from Rowdata', () => {
      const materialNumberDelete = '1234';
      const fakeData = [
        {
          materialNumber: '123',
          quantity: 10,
          info: { valid: true, description: [ValidationDescription.Valid] },
        },
        {
          materialNumber: materialNumberDelete,
          quantity: 10,
          info: { valid: true, description: [ValidationDescription.Valid] },
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
  describe('validateSuccess', () => {
    test('should validate rowData', () => {
      const materialValidations: MaterialValidation[] = [
        { materialNumber15: '20', valid: true },
        { materialNumber15: '30', valid: false },
      ];
      const fakeData: MaterialTableItem[] = [
        {
          materialNumber: '20',
          quantity: 10,
          info: {
            valid: false,
            description: [ValidationDescription.Not_Validated],
          },
        },
        {
          materialNumber: '30',
          quantity: -10,
          info: {
            valid: false,
            description: [ValidationDescription.Not_Validated],
          },
        },
      ];

      const fakeState: CaseState = {
        createCase: {
          ...CREATE_CASE_STORE_STATE_MOCK.createCase,
          rowData: fakeData,
        },
      };

      const expected = fakeData;
      expected[0].info.valid = true;
      expected[0].info.description = [ValidationDescription.Valid];
      expected[1].info.valid = false;
      expected[1].info.description = [
        ValidationDescription.MaterialNumberInValid,
        ValidationDescription.QuantityInValid,
      ];
      const action = validateSuccess({ materialValidations });

      const state = createCaseReducer(fakeState, action);
      const { rowData } = state.createCase;

      expect(rowData).toEqual(expected);
    });
  });
  describe('validateFailure', () => {
    test('should not manipulate state', () => {
      const action = validateFailure();
      const mockState: CaseState = {
        ...CREATE_CASE_STORE_STATE_MOCK,
        createCase: {
          ...CREATE_CASE_STORE_STATE_MOCK.createCase,
          validationLoading: true,
          rowData: [
            {
              info: {
                valid: true,
                description: [ValidationDescription.Valid],
              },
            },
            {
              info: {
                valid: false,
                description: [ValidationDescription.Not_Validated],
              },
            },
          ],
        },
      };

      const expected = [
        {
          info: {
            valid: true,
            description: [ValidationDescription.Valid],
          },
        },
        {
          info: {
            valid: false,
            description: [ValidationDescription.ValidationFailure],
          },
        },
      ];

      const state = createCaseReducer(mockState, action);
      const resultTable = state.createCase.rowData;
      expect(resultTable).toEqual(expected);
    });
  });
  describe('createCase', () => {
    test('should set createCaseLoading', () => {
      const action = createCase();
      const state = createCaseReducer(CREATE_CASE_STORE_STATE_MOCK, action);
      expect(state.createCase.createCaseLoading).toBeTruthy();
    });
  });
  describe('createCaseSuccess', () => {
    test('should set createCaseLoading to false', () => {
      const createdCase: CreateCaseResponse = {
        salesOrg: '0267',
        customerId: '123',
        gqId: '1010',
      };
      const action = createCaseSuccess({ createdCase });
      const state = createCaseReducer(CREATE_CASE_STORE_STATE_MOCK, action);
      expect(state.createCase.createdCase).toEqual(createdCase);
    });
  });
  describe('getSalesOrgsSuccess', () => {
    test('should set salesOrgs', () => {
      const salesOrgs = [new SalesOrg('id', true)];

      const action = getSalesOrgsSuccess({ salesOrgs });
      const state = createCaseReducer(CREATE_CASE_STORE_STATE_MOCK, action);

      expect(state.createCase.customer.salesOrgs).toEqual(salesOrgs);
    });
  });
  describe('getSalesOrgsFailure', () => {
    test('should set errorMessage', () => {
      const errorMessage = `Hello, i'm an error`;

      const action = getSalesOrgsFailure({ errorMessage });
      const state = createCaseReducer(CREATE_CASE_STORE_STATE_MOCK, action);

      expect(state.createCase.customer.errorMessage).toEqual(errorMessage);
    });
  });
  describe('createCaseFailure', () => {
    test('should set createCaseLoading to false', () => {
      const action = createCaseFailure();
      const state = createCaseReducer(CREATE_CASE_STORE_STATE_MOCK, action);
      expect(state.createCase.createCaseLoading).toBeFalsy();
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
  // tslint:disable-next-line: max-file-line-count
});
