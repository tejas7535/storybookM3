import {
  MaterialTableItem,
  MaterialValidation,
  ValidationDescription,
} from '@gq/shared/models/table';

import { PROCESS_CASE_STATE_MOCK } from '../../../../testing/mocks';
import { ProcessCaseActions } from './process-case.action';
import { processCaseFeature, ProcessCaseState } from './process-case.reducer';

describe('Process Case Reducer', () => {
  const errorMessage = 'An error occured';

  describe('Adding Materials', () => {
    describe('addNewItemsToMaterialTable', () => {
      test('should add Material RowDataItem', () => {
        const items: MaterialTableItem[] = [
          {
            id: 0,
            materialNumber: '123465',
            quantity: 100,
          },
        ];
        const action = ProcessCaseActions.addNewItemsToMaterialTable({ items });
        const state = processCaseFeature.reducer(
          PROCESS_CASE_STATE_MOCK,
          action
        );

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
        const action = ProcessCaseActions.addNewItemsToMaterialTable({ items });
        const state = processCaseFeature.reducer(
          PROCESS_CASE_STATE_MOCK,
          action
        );

        expect(state).toEqual({
          ...PROCESS_CASE_STATE_MOCK,
          addMaterialRowData: expectedItems,
          validationLoading: true,
        });
      });
    });
    describe('duplicateItemFromMaterialTable', () => {
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

        const action = ProcessCaseActions.duplicateItemFromMaterialTable({
          itemId: 0,
        });
        const state = processCaseFeature.reducer(fakeState, action);

        const expectedItems = [items[0], { ...items[0], id: 1 }];

        expect(state.addMaterialRowData).toEqual(expectedItems);
      });
    });

    describe('updateItemFromMaterialTable', () => {
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
        const action = ProcessCaseActions.updateItemFromMaterialTable({
          item,
          revalidate: true,
        });
        const state = processCaseFeature.reducer(fakeState, action);

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
        const action = ProcessCaseActions.updateItemFromMaterialTable({
          item,
          revalidate: false,
        });
        const state = processCaseFeature.reducer(fakeState, action);

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
    describe('deleteItemFromMaterialTable', () => {
      test('should delete AddMaterialRowDataItem', () => {
        const action = ProcessCaseActions.deleteItemFromMaterialTable({
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

        const state = processCaseFeature.reducer(fakeState, action);

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

    describe('validateMaterialTableItemsSuccess', () => {
      test('should validate AddMaterials Successful', () => {
        const materialValidations: MaterialValidation[] = [
          {
            materialNumber15: '123465',
            materialDescription: 'desc',
            valid: true,
          },
        ];
        const action = ProcessCaseActions.validateMaterialTableItemsSuccess({
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
        const state = processCaseFeature.reducer(fakeState, action);

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

    describe('validateMaterialTableItemsFailure', () => {
      test('should failed validation', () => {
        const action = ProcessCaseActions.validateMaterialTableItemsFailure({
          errorMessage,
        });

        const state = processCaseFeature.reducer(
          PROCESS_CASE_STATE_MOCK,
          action
        );

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
      const action = ProcessCaseActions.clearRowData();

      const state = processCaseFeature.reducer(PROCESS_CASE_STATE_MOCK, action);

      expect(state.addMaterialRowData).toEqual([]);
    });
  });
});
