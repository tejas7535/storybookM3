import { Action } from '@ngrx/store';

import { CREATE_CASE_STORE_STATE_MOCK } from '../../../../../testing/mocks';
import { FilterNames } from '../../../../shared/components/autocomplete-input/filter-names.enum';
import { AutocompleteSearch, IdValue } from '../../../../shared/models/search';
import {
  MaterialTableItem,
  MaterialValidation,
  ValidationDescription,
} from '../../../../shared/models/table';
import {
  addRowDataItem,
  autocomplete,
  autocompleteFailure,
  autocompleteSuccess,
  clearCreateCaseRowData,
  clearCustomer,
  createCase,
  createCaseFailure,
  createCaseSuccess,
  createCustomerCase,
  createCustomerCaseFailure,
  createCustomerCaseSuccess,
  deleteRowDataItem,
  getPLsAndSeries,
  getPLsAndSeriesFailure,
  getPLsAndSeriesSuccess,
  getSalesOrgsFailure,
  getSalesOrgsSuccess,
  importCase,
  importCaseFailure,
  importCaseSuccess,
  pasteRowDataItems,
  resetAllAutocompleteOptions,
  resetAutocompleteMaterials,
  resetCustomerFilter,
  resetPLsAndSeries,
  resetProductLineAndSeries,
  selectAutocompleteOption,
  setSelectedAutocompleteOption,
  setSelectedGpsdGroups,
  setSelectedProductLines,
  setSelectedSeries,
  unselectAutocompleteOptions,
  updateRowDataItem,
  validateFailure,
  validateSuccess,
} from '../../actions';
import { SalesIndication } from '../transactions/models/sales-indication.enum';
import {
  createCaseReducer,
  CreateCaseState,
  initialState,
  reducer,
} from './create-case.reducer';
import { CreateCaseResponse, SalesOrg } from './models';

describe('Create Case Reducer', () => {
  describe('autocomplete Actions', () => {
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
          autocompleteLoading: FilterNames.CUSTOMER,
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

        const fakeState: CreateCaseState = {
          ...CREATE_CASE_STORE_STATE_MOCK,
          autocompleteLoading: FilterNames.CUSTOMER,
          autocompleteItems: [
            { filter: FilterNames.CUSTOMER, options: fakeOptions },
          ],
        };

        const action = autocompleteSuccess({
          options: autoCompleteOptions,
          filter: FilterNames.CUSTOMER,
        });

        const state = createCaseReducer(fakeState, action);

        const stateItem = state.autocompleteItems[0].options;
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
      const fakeOptions = [
        new IdValue('mcd', 'mercedes', false),
        new IdValue('aud', 'audi', false),
      ];
      const selectOption = new IdValue('mcd', 'mercedes', true);

      const fakeState: CreateCaseState = {
        ...CREATE_CASE_STORE_STATE_MOCK,
        autocompleteItems: [
          {
            filter: FilterNames.CUSTOMER,
            options: fakeOptions,
          },
          { filter: FilterNames.MATERIAL_NUMBER, options: fakeOptions },
        ],
      };
      test('should set customer option selected true', () => {
        const action = selectAutocompleteOption({
          option: selectOption,
          filter: FilterNames.CUSTOMER,
        });

        const state = createCaseReducer(fakeState, action);

        expect(state.autocompleteItems[0].options).toEqual([
          selectOption,
          fakeOptions[1],
        ]);
        expect(state.customer.salesOrgsLoading).toBeTruthy();
        expect(state.customer.customerId).toEqual(selectOption.id);
      });

      test('should set material option selected true', () => {
        const action = selectAutocompleteOption({
          option: selectOption,
          filter: FilterNames.MATERIAL_NUMBER,
        });
        fakeState.autocompleteItems[1].options = [];

        fakeState.autocompleteLoading = FilterNames.MATERIAL_NUMBER;

        const state = createCaseReducer(fakeState, action);

        expect(state.autocompleteItems[1].options).toEqual([selectOption]);
        expect(state.customer.salesOrgsLoading).toBeFalsy();
        expect(state.customer.customerId).toEqual(
          fakeState.customer.customerId
        );
      });
    });
    describe('setSelectedAutocompleteOption', () => {
      test('should set option for materialNumber and Description', () => {
        const fakeState: CreateCaseState = {
          ...CREATE_CASE_STORE_STATE_MOCK,
          autocompleteItems: [
            { filter: FilterNames.MATERIAL_NUMBER, options: [] },
            { filter: FilterNames.MATERIAL_DESCRIPTION, options: [] },
          ],
        };

        const option = new IdValue('mcd', 'mercedes', true);
        const action = setSelectedAutocompleteOption({
          filter: FilterNames.MATERIAL_NUMBER,
          option,
        });
        const state = createCaseReducer(fakeState, action);

        expect(
          state.autocompleteItems.find(
            (i) => i.filter === FilterNames.MATERIAL_NUMBER
          ).options
        ).toEqual([option]);
        expect(
          state.autocompleteItems.find(
            (i) => i.filter === FilterNames.MATERIAL_DESCRIPTION
          ).options
        ).toEqual([{ selected: true, id: option.value, value: option.id }]);
      });
      test('should set option for customer', () => {
        const fakeState: CreateCaseState = {
          ...CREATE_CASE_STORE_STATE_MOCK,
          autocompleteItems: [{ filter: FilterNames.CUSTOMER, options: [] }],
        };

        const option = new IdValue(
          'customerId',
          'customerName',
          true,
          'customerCountry'
        );
        const action = setSelectedAutocompleteOption({
          filter: FilterNames.CUSTOMER,
          option,
        });
        const state = createCaseReducer(fakeState, action);

        expect(
          state.autocompleteItems.find((i) => i.filter === FilterNames.CUSTOMER)
            .options
        ).toEqual([option]);
      });
    });
    describe('unselectAutocompleteOptions', () => {
      const fakeOptions = [
        new IdValue('mcd', 'mercedes', true),
        new IdValue('aud', 'audi', false),
      ];
      const fakeState: CreateCaseState = {
        ...CREATE_CASE_STORE_STATE_MOCK,
        autocompleteItems: [
          {
            filter: FilterNames.CUSTOMER,
            options: fakeOptions,
          },
          { filter: FilterNames.MATERIAL_NUMBER, options: fakeOptions },
        ],
      };

      test('should unselect customer options', () => {
        const action = unselectAutocompleteOptions({
          filter: FilterNames.CUSTOMER,
        });

        const state = createCaseReducer(fakeState, action);

        expect(state.autocompleteItems[0].options).toEqual([
          { ...fakeOptions[0], selected: false },
          fakeOptions[1],
        ]);
        expect(state.customer.customerId).toEqual(undefined);
        expect(state.customer.salesOrgs).toEqual([]);
      });
      test('should unselect material options', () => {
        const action = unselectAutocompleteOptions({
          filter: FilterNames.MATERIAL_NUMBER,
        });
        const state = createCaseReducer(fakeState, action);
        state.customer.customerId = '82563';

        expect(state.autocompleteItems[1].options).toEqual([
          { ...fakeOptions[0], selected: false },
          fakeOptions[1],
        ]);
        expect(state.customer.customerId).toEqual('82563');
        expect(state.customer.salesOrgs).toEqual(fakeState.customer.salesOrgs);
      });
    });
    describe('resetAllAutocompleteOptions', () => {
      test('should reset all autocomplete options', () => {
        const fakeOptions = [
          new IdValue('mcd', 'mercedes', true),
          new IdValue('aud', 'audi', false),
        ];
        const fakeState: CreateCaseState = {
          ...CREATE_CASE_STORE_STATE_MOCK,
          autocompleteItems: [
            {
              filter: FilterNames.CUSTOMER,
              options: fakeOptions,
            },
            { filter: FilterNames.MATERIAL_NUMBER, options: fakeOptions },
          ],
        };

        const action = resetAllAutocompleteOptions();

        const state = createCaseReducer(fakeState, action);

        expect(state.autocompleteItems).toEqual(initialState.autocompleteItems);
      });
    });
    describe('resetAutocompleteMaterials reducer', () => {
      it('should handle resetAutocompleteMaterials', () => {
        const fakeOptions = [
          new IdValue('mcd', 'mercedes', true),
          new IdValue('aud', 'audi', false),
        ];
        const fakeState: CreateCaseState = {
          ...CREATE_CASE_STORE_STATE_MOCK,
          autocompleteItems: [
            {
              filter: FilterNames.SAP_QUOTATION,
              options: fakeOptions,
            },
            {
              filter: FilterNames.CUSTOMER,
              options: fakeOptions,
            },
            { filter: FilterNames.MATERIAL_NUMBER, options: fakeOptions },
            { filter: FilterNames.MATERIAL_DESCRIPTION, options: fakeOptions },
          ],
        };
        const action = resetAutocompleteMaterials();
        const state = createCaseReducer(fakeState, action);

        expect(state).toEqual({
          ...CREATE_CASE_STORE_STATE_MOCK,
          autocompleteItems: [
            {
              filter: FilterNames.SAP_QUOTATION,
              options: fakeOptions,
            },
            {
              filter: FilterNames.CUSTOMER,
              options: fakeOptions,
            },
            { filter: FilterNames.MATERIAL_NUMBER, options: [] },
            {
              filter: FilterNames.MATERIAL_DESCRIPTION,
              options: [],
            },
          ],
        });
      });
    });
  });
  describe('rowData Actions', () => {
    describe('addRowDataItem', () => {
      test('should addItem to Row Data', () => {
        const fakeData = [
          {
            id: 0,
            materialNumber: '123',
            quantity: 10,
            info: { valid: true, description: [ValidationDescription.Valid] },
          },
        ];
        const items = [
          {
            id: 1,
            materialNumber: '1234',
            quantity: 105,
            info: { valid: true, description: [ValidationDescription.Valid] },
          },
        ];
        const fakeState: CreateCaseState = {
          ...CREATE_CASE_STORE_STATE_MOCK,
          rowData: fakeData,
        };

        const action = addRowDataItem({ items });

        const state = createCaseReducer(fakeState, action);

        expect(state.rowData).toEqual([fakeData[0], ...items]);
      });
    });
    describe('pasteRowDataItems', () => {
      test('should paste items in table', () => {
        const fakeData: MaterialTableItem[] = [
          {
            id: 0,
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
            id: 1,
            materialNumber: '1',
            quantity: 10,
            info: {
              valid: false,
              description: [ValidationDescription.MaterialNumberInValid],
            },
          },
          {
            id: 2,
            materialNumber: '12',
            quantity: 10,
            info: {
              valid: false,
              description: [ValidationDescription.MaterialNumberInValid],
            },
          },
        ];
        const fakeState: CreateCaseState = {
          ...CREATE_CASE_STORE_STATE_MOCK,
          rowData: fakeData,
        };

        const action = pasteRowDataItems({ items });

        const state = createCaseReducer(fakeState, action);
        expect(state.rowData).toEqual([...fakeData, ...items]);
      });
    });
    describe('updateRowDataItem', () => {
      test('should update item', () => {
        const mockedRowData: MaterialTableItem[] = [
          {
            id: 0,
            materialDescription: 'desc',
            materialNumber: 'matNumber',
            quantity: 1,
            info: {
              valid: false,
              description: [ValidationDescription.QuantityInValid],
            },
          },
          {
            id: 1,
            materialDescription: 'desc',
            materialNumber: 'matNumber',
            quantity: 1,
            info: { valid: true, description: [ValidationDescription.Valid] },
          },
        ];

        const item: MaterialTableItem = {
          id: 0,
          materialDescription: 'descUpdated',
          materialNumber: 'matNumberUpdated',
          quantity: 2,
          info: { valid: true, description: [ValidationDescription.Valid] },
        };

        const fakeState: CreateCaseState = {
          ...CREATE_CASE_STORE_STATE_MOCK,
          rowData: mockedRowData,
        };

        const action = updateRowDataItem({ item });
        const state = createCaseReducer(fakeState, action);

        expect(state.rowData).toEqual([item, mockedRowData[1]]);
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

        const fakeState: CreateCaseState = {
          ...CREATE_CASE_STORE_STATE_MOCK,
          rowData: fakeData,
        };

        const action = clearCreateCaseRowData();

        const state = createCaseReducer(fakeState, action);

        expect(state.rowData).toEqual([]);
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

        const fakeState: CreateCaseState = {
          ...CREATE_CASE_STORE_STATE_MOCK,
          rowData: fakeData,
        };

        const action = deleteRowDataItem({
          materialNumber: materialNumberDelete,
          quantity: 10,
        });

        const state = createCaseReducer(fakeState, action);

        expect(state.rowData).toEqual([fakeData[0]]);
      });
    });
  });
  describe('validate Actions', () => {
    describe('validateSuccess', () => {
      test('should validate rowData', () => {
        const materialValidations: MaterialValidation[] = [
          { materialNumber15: '20', materialDescription: 'desc', valid: true },
          { materialNumber15: '30', materialDescription: 'desc', valid: false },
        ];
        const fakeData: MaterialTableItem[] = [
          {
            materialNumber: '20',
            materialDescription: 'desc',
            quantity: 10,
            info: {
              valid: false,
              description: [ValidationDescription.Not_Validated],
            },
          },
          {
            materialNumber: '30',
            materialDescription: 'desc',
            quantity: -10,
            info: {
              valid: false,
              description: [ValidationDescription.Not_Validated],
            },
          },
        ];

        const fakeState: CreateCaseState = {
          ...CREATE_CASE_STORE_STATE_MOCK,
          rowData: fakeData,
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

        expect(state.rowData).toEqual(expected);
      });
    });
    describe('validateFailure', () => {
      test('should not manipulate state', () => {
        const action = validateFailure();
        const mockState: CreateCaseState = {
          ...CREATE_CASE_STORE_STATE_MOCK,
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
        expect(state.rowData).toEqual(expected);
      });
    });
  });
  describe('createCase Actions', () => {
    describe('createCase', () => {
      test('should set createCaseLoading', () => {
        const action = createCase();
        const state = createCaseReducer(CREATE_CASE_STORE_STATE_MOCK, action);
        expect(state.createCaseLoading).toBeTruthy();
      });
    });
    describe('createCaseSuccess', () => {
      test('should set createCaseLoading to false', () => {
        const createdCase: CreateCaseResponse = {
          salesOrg: '0267',
          customerId: '123',
          gqId: 1010,
        };
        const action = createCaseSuccess({ createdCase });
        const state = createCaseReducer(CREATE_CASE_STORE_STATE_MOCK, action);
        expect(state.createdCase).toEqual(createdCase);
      });
    });
    describe('createCaseFailure', () => {
      test('should set createCaseLoading to false', () => {
        const errorMessage = 'error';
        const action = createCaseFailure({ errorMessage });
        const state = createCaseReducer(CREATE_CASE_STORE_STATE_MOCK, action);
        expect(state.createCaseLoading).toBeFalsy();
        expect(state.errorMessage).toBe(errorMessage);
      });
    });
  });
  describe('importCase Actions', () => {
    describe('importCase', () => {
      test('should set createCase loading', () => {
        const action = importCase();
        const state = createCaseReducer(CREATE_CASE_STORE_STATE_MOCK, action);
        expect(state.createCaseLoading).toBeTruthy();
      });
    });
    describe('importCaseSuccess', () => {
      test('should set createCase loading false', () => {
        const action = importCaseSuccess({ gqId: 123 });
        const state = createCaseReducer(CREATE_CASE_STORE_STATE_MOCK, action);
        expect(state.createCaseLoading).toBeFalsy();
        expect(state.autocompleteItems).toEqual(initialState.autocompleteItems);
      });
    });
    describe('importCaseFailure', () => {
      test('should set createCase loading false and error Message', () => {
        const errorMessage = 'error';
        const action = importCaseFailure({ errorMessage });
        const state = createCaseReducer(CREATE_CASE_STORE_STATE_MOCK, action);
        expect(state.createCaseLoading).toBeFalsy();
        expect(state.errorMessage).toEqual(errorMessage);
      });
    });
  });
  describe('getSalesOrg Actions', () => {
    describe('getSalesOrgsSuccess', () => {
      test('should set salesOrgs', () => {
        const salesOrgs = [new SalesOrg('id', true)];

        const action = getSalesOrgsSuccess({ salesOrgs });
        const state = createCaseReducer(CREATE_CASE_STORE_STATE_MOCK, action);

        expect(state.customer.salesOrgs).toEqual(salesOrgs);
      });
    });
    describe('getSalesOrgsFailure', () => {
      test('should set errorMessage', () => {
        const errorMessage = `Hello, i'm an error`;

        const action = getSalesOrgsFailure({ errorMessage });
        const state = createCaseReducer(CREATE_CASE_STORE_STATE_MOCK, action);

        expect(state.customer.errorMessage).toEqual(errorMessage);
      });
    });
  });
  describe('clearCustomer', () => {
    test('should clearCustomer', () => {
      const action = clearCustomer();

      const stateMock = {
        ...CREATE_CASE_STORE_STATE_MOCK,
        customer: {
          customerId: '123',
          salesOrgs: [{ id: '1', selected: true }],
          errorMessage: '',
          salesOrgsLoading: false,
        },
      };

      const state = createCaseReducer(stateMock, action);

      expect(state.customer).toEqual(initialState.customer);
    });
  });
  describe('PLsAndSeries Actions', () => {
    describe('getPLsAndSeries', () => {
      test('should set loading', () => {
        const action = getPLsAndSeries({
          customerFilters: {
            includeQuotationHistory: true,
            salesIndications: [SalesIndication.INVOICE],
            historicalDataLimitInYear: 2,
          } as any,
        });

        const state = createCaseReducer(CREATE_CASE_STORE_STATE_MOCK, action);

        expect(state.plSeries.loading).toBeTruthy();
        expect(
          state.plSeries.materialSelection.includeQuotationHistory
        ).toBeTruthy();
        expect(state.plSeries.materialSelection.salesIndications).toEqual([
          SalesIndication.INVOICE,
        ]);
      });
    });
    describe('getPLsAndSeriesSuccess', () => {
      test('should set loading false', () => {
        const plsAndSeries = {} as any;
        const action = getPLsAndSeriesSuccess({ plsAndSeries });

        const state = createCaseReducer(CREATE_CASE_STORE_STATE_MOCK, action);

        expect(state.plSeries.loading).toBeFalsy();
        expect(state.plSeries.plsAndSeries).toEqual(plsAndSeries);
      });
    });
    describe('getPLsAndSeriesFailure', () => {
      test('should set loading false', () => {
        const errorMessage = 'error';
        const action = getPLsAndSeriesFailure({ errorMessage });

        const state = createCaseReducer(CREATE_CASE_STORE_STATE_MOCK, action);

        expect(state.plSeries.loading).toBeFalsy();
        expect(state.plSeries.errorMessage).toEqual(errorMessage);
      });
    });
    describe('setSelectedProductLines', () => {
      test('should set selected product lines', () => {
        const selectedProductLines = [] as any;
        const action = setSelectedProductLines({ selectedProductLines });

        const state = createCaseReducer(CREATE_CASE_STORE_STATE_MOCK, action);

        expect(
          state.plSeries.plsAndSeries.pls.every((i) => !i.selected)
        ).toBeTruthy();
      });
    });
    describe('setSelectedSeries', () => {
      test('should set selected series', () => {
        const selectedSeries = [] as any;
        const action = setSelectedSeries({ selectedSeries });

        const state = createCaseReducer(CREATE_CASE_STORE_STATE_MOCK, action);

        expect(
          state.plSeries.plsAndSeries.series.every((i) => !i.selected)
        ).toBeTruthy();
      });
    });
    describe('setSelectedGpsdGroups', () => {
      test('should set selected gpsd groups', () => {
        const selectedGpsdGroups = ['F02'];
        const action = setSelectedGpsdGroups({ selectedGpsdGroups });
        const storeMock = {
          ...CREATE_CASE_STORE_STATE_MOCK,
          plSeries: {
            ...CREATE_CASE_STORE_STATE_MOCK.plSeries,
            plsAndSeries: {
              ...CREATE_CASE_STORE_STATE_MOCK.plSeries.plsAndSeries,
              gpsdGroupIds: [{ selected: false, value: 'F02' }],
            },
          },
        };
        const state = createCaseReducer(storeMock, action);

        expect(
          state.plSeries.plsAndSeries.gpsdGroupIds.every((i) => i.selected)
        ).toBeTruthy();
      });
    });
    describe('resetProductLineAndSeries', () => {
      test('should reset productLine and series', () => {
        const action = resetProductLineAndSeries();

        const state = createCaseReducer(CREATE_CASE_STORE_STATE_MOCK, action);

        expect(state.plSeries).toEqual(initialState.plSeries);
      });
    });

    describe('createCustomerCase Actions', () => {
      describe('createCustomerCase', () => {
        test('should set loading true', () => {
          const action = createCustomerCase();

          const state = createCaseReducer(CREATE_CASE_STORE_STATE_MOCK, action);

          expect(state.createCaseLoading).toBeTruthy();
        });
      });

      describe('createCustomerCaseSuccess', () => {
        test('should set loading to false', () => {
          const action = createCustomerCaseSuccess();

          const state = createCaseReducer(CREATE_CASE_STORE_STATE_MOCK, action);
          expect(state.createCaseLoading).toBeFalsy();
        });
      });

      describe('createCustomerCaseFailure', () => {
        test('should save error message', () => {
          const errorMessage = 'errorMessage';
          const action = createCustomerCaseFailure({ errorMessage });

          const state = createCaseReducer(CREATE_CASE_STORE_STATE_MOCK, action);

          expect(state.errorMessage).toEqual(errorMessage);
        });
      });
    });
  });
  describe('resetCustomerFilter', () => {
    test('should reset customer to initalState', () => {
      const action = resetCustomerFilter();

      const state = createCaseReducer(CREATE_CASE_STORE_STATE_MOCK, action);
      expect(state.customer).toEqual(initialState.customer);
      expect(state.autocompleteItems).toEqual(initialState.autocompleteItems);
    });
  });
  describe('resetPLsAndSeries', () => {
    test('should reset plSeries to initalState', () => {
      const action = resetPLsAndSeries();

      const state = createCaseReducer(CREATE_CASE_STORE_STATE_MOCK, action);
      expect(state.plSeries).toEqual(initialState.plSeries);
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
  // eslint-disable-next-line max-lines
});
