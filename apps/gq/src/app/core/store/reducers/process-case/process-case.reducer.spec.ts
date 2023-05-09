import { Action } from '@ngrx/store';

import { PROCESS_CASE_STATE_MOCK } from '../../../../../testing/mocks';
import {
  MaterialTableItem,
  MaterialValidation,
  ValidationDescription,
} from '../../../../shared/models/table';
import {
  addMaterialRowDataItems,
  clearProcessCaseRowData,
  deleteMaterialRowDataItem,
  duplicateMaterialRowDataItem,
  updateMaterialRowDataItem,
  validateAddMaterialsOnCustomerAndSalesOrgFailure,
  validateAddMaterialsOnCustomerAndSalesOrgSuccess,
} from '../../actions';
import {
  processCaseReducer,
  ProcessCaseState,
  reducer,
} from './process-case.reducer';

describe('Process Case Reducer', () => {
  const errorMessage = 'An error occured';

  describe('Adding Materials', () => {
    describe('addMaterialRowDataItem', () => {
      test('should add Material RowDataItem', () => {
        const items: MaterialTableItem[] = [
          {
            id: 0,
            materialNumber: '123465',
            quantity: 100,
          },
        ];
        const action = addMaterialRowDataItems({ items });
        const state = processCaseReducer(PROCESS_CASE_STATE_MOCK, action);

        expect(state).toEqual({
          ...PROCESS_CASE_STATE_MOCK,
          addMaterialRowData: items,
          validationLoading: true,
        });
      });
      test('should add Material RowDataItem with target price', () => {
        const items: MaterialTableItem[] = [
          {
            id: 0,
            materialNumber: '123465',
            quantity: 100,
            targetPrice: 100.05,
          },
        ];
        const expectedItems: MaterialTableItem[] = [
          {
            id: 0,
            materialNumber: '123465',
            quantity: 100,
            targetPrice: 100.05,
          },
        ];
        const action = addMaterialRowDataItems({ items });
        const state = processCaseReducer(PROCESS_CASE_STATE_MOCK, action);

        expect(state).toEqual({
          ...PROCESS_CASE_STATE_MOCK,
          addMaterialRowData: expectedItems,
          validationLoading: true,
        });
      });
    });
    describe('duplicateMaterialRowDataItem', () => {
      test('should call table service duplicate', () => {
        const items: MaterialTableItem[] = [
          {
            id: 0,
            materialNumber: '123465',
            quantity: 100,
          },
        ];
        const fakeState: ProcessCaseState = {
          ...PROCESS_CASE_STATE_MOCK,
          addMaterialRowData: items,
        };

        const action = duplicateMaterialRowDataItem({ itemId: 0 });
        const state = processCaseReducer(fakeState, action);

        const expectedItems = [items[0], { ...items[0], id: 1 }];

        expect(state.addMaterialRowData).toEqual(expectedItems);
      });
    });

    describe('updateMaterialRowDataItem', () => {
      test('should update item with revalidation', () => {
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

        const fakeState: ProcessCaseState = {
          ...PROCESS_CASE_STATE_MOCK,
          addMaterialRowData: mockedRowData,
        };
        const action = updateMaterialRowDataItem({ item, revalidate: true });
        const state = processCaseReducer(fakeState, action);

        expect(state.addMaterialRowData).toEqual([
          {
            ...item,
            info: {
              valid: false,
              description: [ValidationDescription.Not_Validated],
              errorCode: undefined,
            },
          },
          mockedRowData[1],
        ]);
      });

      test('should update item without revalidation', () => {
        const mockedRowData: MaterialTableItem[] = [
          {
            id: 0,
            materialDescription: 'desc',
            materialNumber: 'matNumber',
            quantity: 1,
            currency: 'EUR',
            UoM: '1',
            priceUnit: 100,
            targetPrice: 150,
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

        // Quantity has changed
        const item: MaterialTableItem = {
          id: 0,
          materialDescription: 'desc',
          materialNumber: 'matNumber',
          quantity: 10,
          targetPrice: 150,
          info: { valid: true, description: [ValidationDescription.Valid] },
        };

        const fakeState: ProcessCaseState = {
          ...PROCESS_CASE_STATE_MOCK,
          addMaterialRowData: mockedRowData,
        };
        const action = updateMaterialRowDataItem({ item, revalidate: false });
        const state = processCaseReducer(fakeState, action);

        expect(state.addMaterialRowData).toEqual([
          {
            ...item,
            currency: 'EUR',
            priceUnit: 100,
            UoM: '1',
          },
          mockedRowData[1],
        ]);
      });
    });
    describe('deleteMaterialRowDataItem', () => {
      test('should delete AddMaterialRowDataItem', () => {
        const action = deleteMaterialRowDataItem({
          id: 10,
        });

        const fakeState = {
          ...PROCESS_CASE_STATE_MOCK,
          addMaterialRowData: [
            {
              id: 10,
              materialNumber: '123465',
              quantity: 100,
            },
            {
              id: 20,
              materialNumber: '987654',
              quantity: 100,
            },
          ],
        };

        const state = processCaseReducer(fakeState, action);

        expect(state).toEqual({
          ...PROCESS_CASE_STATE_MOCK,
          addMaterialRowData: [
            {
              id: 20,
              materialNumber: '987654',
              quantity: 100,
            },
          ],
        });
      });
    });

    describe('validateAddMaterialsSuccess', () => {
      test('should validate AddMaterials Successful', () => {
        const materialValidations: MaterialValidation[] = [
          {
            materialNumber15: '123465',
            materialDescription: 'desc',
            valid: true,
          },
        ];
        const action = validateAddMaterialsOnCustomerAndSalesOrgSuccess({
          materialValidations,
        });

        const fakeState = {
          ...PROCESS_CASE_STATE_MOCK,
          addMaterialRowData: [
            {
              materialDescription: 'desc',
              materialNumber: '123465',
              quantity: 100,
            },
          ],
        };
        const state = processCaseReducer(fakeState, action);

        expect(state).toEqual({
          ...PROCESS_CASE_STATE_MOCK,
          addMaterialRowData: [
            {
              materialNumber: '123465',
              materialDescription: 'desc',
              quantity: 100,
              info: {
                description: ['valid'],
                valid: true,
              },
            },
          ],
          validationLoading: false,
        });
      });
    });

    describe('validateAddMaterialsFailure', () => {
      test('should failed validation', () => {
        const action = validateAddMaterialsOnCustomerAndSalesOrgFailure({
          errorMessage,
        });

        const state = processCaseReducer(PROCESS_CASE_STATE_MOCK, action);

        expect(state).toEqual({
          ...PROCESS_CASE_STATE_MOCK,
          errorMessage,
          addMaterialRowData: [],
          validationLoading: false,
        });
      });
    });
  });

  describe('clearRowData', () => {
    test('should clearRowData', () => {
      const action = clearProcessCaseRowData();

      const state = processCaseReducer(PROCESS_CASE_STATE_MOCK, action);

      expect(state.addMaterialRowData).toEqual([]);
    });
  });

  describe('Reducer function', () => {
    test('should return searchReducer', () => {
      // prepare any action
      const action: Action = clearProcessCaseRowData();
      expect(reducer(PROCESS_CASE_STATE_MOCK, action)).toEqual(
        processCaseReducer(PROCESS_CASE_STATE_MOCK, action)
      );
    });
  });
});
