import { Action } from '@ngrx/store';

import {
  CUSTOMER_MOCK,
  PROCESS_CASE_STATE_MOCK,
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
  SIMULATED_QUOTATION_MOCK,
} from '../../../../../testing/mocks';
import { Quotation } from '../../../../shared/models/';
import { SapCallInProgress } from '../../../../shared/models/quotation';
import {
  PriceSource,
  QuotationDetail,
} from '../../../../shared/models/quotation-detail';
import {
  MaterialTableItem,
  MaterialValidation,
  ValidationDescription,
} from '../../../../shared/models/table';
import {
  addMaterialRowDataItem,
  addMaterials,
  addMaterialsFailure,
  addMaterialsSuccess,
  addSimulatedQuotation,
  clearProcessCaseRowData,
  createSapQuote,
  createSapQuoteFailure,
  createSapQuoteSuccess,
  deleteAddMaterialRowDataItem,
  deselectQuotationDetail,
  loadCustomer,
  loadCustomerFailure,
  loadCustomerSuccess,
  loadQuotationFailure,
  loadQuotationInInterval,
  loadQuotationSuccess,
  pasteRowDataItemsToAddMaterial,
  refreshSapPricing,
  refreshSapPricingFailure,
  refreshSapPricingSuccess,
  removePositions,
  removePositionsFailure,
  removePositionsSuccess,
  removeSimulatedQuotationDetail,
  resetSimulatedQuotation,
  selectQuotation,
  selectQuotationDetail,
  setSelectedQuotationDetail,
  updateMaterialRowDataItem,
  updateQuotation,
  updateQuotationDetails,
  updateQuotationDetailsFailure,
  updateQuotationDetailsSuccess,
  updateQuotationFailure,
  updateQuotationSuccess,
  uploadSelectionToSap,
  uploadSelectionToSapFailure,
  uploadSelectionToSapSuccess,
  validateAddMaterialsFailure,
  validateAddMaterialsSuccess,
} from '../../actions';
import { QuotationIdentifier } from './models';
import {
  initialState,
  processCaseReducer,
  ProcessCaseState,
  reducer,
} from './process-case.reducer';

describe('Quotation Reducer', () => {
  const errorMessage = 'An error occured';

  describe('customer', () => {
    describe('customerDetails', () => {
      test('should set customerDetails loading', () => {
        const action = loadCustomer();
        const state = processCaseReducer(PROCESS_CASE_STATE_MOCK, action);

        expect(state).toEqual({
          ...PROCESS_CASE_STATE_MOCK,
          customer: {
            ...PROCESS_CASE_STATE_MOCK.customer,
            item: initialState.customer.item,
            customerLoading: true,
          },
        });
      });
    });

    describe('customerDetailsSuccess', () => {
      test('should set customer details', () => {
        const item = CUSTOMER_MOCK;

        const fakeState = {
          ...PROCESS_CASE_STATE_MOCK,
          customer: {
            ...PROCESS_CASE_STATE_MOCK.customer,
            item: CUSTOMER_MOCK,
          },
        };
        const action = loadCustomerSuccess({ item });
        const state = processCaseReducer(fakeState, action);

        const stateItem = state.customer;
        expect(stateItem.item).toEqual(item);
      });
    });

    describe('customerDetailsFailure', () => {
      test('should not manipulate state', () => {
        const action = loadCustomerFailure({ errorMessage });

        const fakeState = {
          ...PROCESS_CASE_STATE_MOCK,
          customer: {
            ...PROCESS_CASE_STATE_MOCK.customer,
          },
        };
        const state = processCaseReducer(fakeState, action);

        expect(state.customer.customerLoading).toBeFalsy();
        expect(state.customer.errorMessage).toEqual(errorMessage);
      });
    });
  });

  describe('quotation', () => {
    describe('selectQuotation', () => {
      test('should set selectQuotation', () => {
        const quotationIdentifier = new QuotationIdentifier(123, '0267', '456');

        const action = selectQuotation({ quotationIdentifier });
        const state = processCaseReducer(PROCESS_CASE_STATE_MOCK, action);

        expect(state).toEqual({
          ...PROCESS_CASE_STATE_MOCK,
          quotationIdentifier,
        });
      });
    });

    describe('quotationDetails', () => {
      test('should set quotationDetails loading', () => {
        const action = loadQuotationInInterval();
        const state = processCaseReducer(PROCESS_CASE_STATE_MOCK, action);

        expect(state).toEqual({
          ...PROCESS_CASE_STATE_MOCK,
          quotation: {
            ...PROCESS_CASE_STATE_MOCK.quotation,
            item: initialState.quotation.item,
            quotationLoading: true,
          },
        });
      });
    });

    describe('quotationDetailsSuccess', () => {
      test('should set quotation details', () => {
        const item = QUOTATION_MOCK;

        const fakeState = {
          ...PROCESS_CASE_STATE_MOCK,
          quotation: {
            ...PROCESS_CASE_STATE_MOCK.quotation,
            item: QUOTATION_MOCK,
          },
        };
        const action = loadQuotationSuccess({ item });
        const state = processCaseReducer(fakeState, action);

        const stateItem = state.quotation;
        expect(stateItem.item).toEqual(item);
      });
    });

    describe('quotationDetailsFailure', () => {
      test('should not manipulate state', () => {
        const action = loadQuotationFailure({ errorMessage });

        const fakeState = {
          ...PROCESS_CASE_STATE_MOCK,
          quotation: {
            ...PROCESS_CASE_STATE_MOCK.quotation,
          },
        };

        const state = processCaseReducer(fakeState, action);

        expect(state.quotation.quotationLoading).toBeFalsy();
        expect(state.quotation.errorMessage).toEqual(errorMessage);
      });
    });
  });

  describe('updateQuotationDetails', () => {
    describe('updateQuotationDetailsPrice', () => {
      test('should update a quotation details price', () => {
        const updateQuotationDetailList = [
          {
            gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
            price: 20,
            priceSource: PriceSource.MANUAL,
          },
        ];

        const action = updateQuotationDetails({
          updateQuotationDetailList,
        });

        const state = processCaseReducer(PROCESS_CASE_STATE_MOCK, action);

        expect(state.quotation.updateLoading).toBeTruthy();
      });
    });

    describe('updateQuotationDetailsSuccess', () => {
      test('should update quotationDetails', () => {
        const newDetail: QuotationDetail = {
          ...QUOTATION_DETAIL_MOCK,
          price: 210,
        };
        const updatedQuotation = {
          ...QUOTATION_MOCK,
          quotationDetails: [newDetail],
        };

        const action = updateQuotationDetailsSuccess({ updatedQuotation });

        const fakeState = {
          ...PROCESS_CASE_STATE_MOCK,
          quotation: {
            ...PROCESS_CASE_STATE_MOCK.quotation,
            item: QUOTATION_MOCK,
          },
        };

        const state = processCaseReducer(fakeState, action);

        const stateItem = state.quotation;
        expect(stateItem.item.quotationDetails[0]).toEqual(newDetail);
      });
    });

    describe('updateQuotationDetailsFailure', () => {
      test('should not manipulate state', () => {
        const action = updateQuotationDetailsFailure({ errorMessage });

        const fakeState = {
          ...PROCESS_CASE_STATE_MOCK,
          quotation: {
            ...PROCESS_CASE_STATE_MOCK.quotation,
          },
        };

        const state = processCaseReducer(fakeState, action);

        expect(state.quotation.errorMessage).toEqual(errorMessage);
      });
    });
  });

  describe('Adding Materials', () => {
    describe('addMaterials', () => {
      test('should set dialog Shown to true', () => {
        const action = addMaterials();

        const state = processCaseReducer(PROCESS_CASE_STATE_MOCK, action);

        expect(state).toEqual({
          ...PROCESS_CASE_STATE_MOCK,
          quotation: {
            ...PROCESS_CASE_STATE_MOCK.quotation,
            updateLoading: true,
          },
        });
      });
    });

    describe('addMaterialsSuccess', () => {
      test('should set dialog Shown to true', () => {
        const newItem = { ...QUOTATION_DETAIL_MOCK, quotationItemId: 20 };
        const updatedQuotation = {
          ...QUOTATION_MOCK,
          quotationDetails: [newItem],
        };

        const fakeState = {
          ...PROCESS_CASE_STATE_MOCK,
          quotation: {
            ...PROCESS_CASE_STATE_MOCK.quotation,
            item: QUOTATION_MOCK,
          },
        };
        const action = addMaterialsSuccess({ updatedQuotation });
        const state = processCaseReducer(fakeState, action);

        const stateItem = state.quotation;
        expect(stateItem.item.quotationDetails).toEqual([
          ...fakeState.quotation.item.quotationDetails,
          newItem,
        ]);
      });
    });

    describe('addMaterialsFailure', () => {
      test('should not manipulate state', () => {
        const action = addMaterialsFailure({ errorMessage });

        const fakeState = {
          ...PROCESS_CASE_STATE_MOCK,
          quotation: {
            ...PROCESS_CASE_STATE_MOCK.quotation,
          },
        };

        const state = processCaseReducer(fakeState, action);

        expect(state.quotation.quotationLoading).toBeFalsy();
        expect(state.quotation.errorMessage).toEqual(errorMessage);
      });
    });

    describe('addMaterialRowDataItem', () => {
      test('should add Material RowDataItem', () => {
        const items: MaterialTableItem[] = [
          {
            materialNumber: '123465',
            quantity: 100,
          },
        ];
        const action = addMaterialRowDataItem({ items });
        const state = processCaseReducer(PROCESS_CASE_STATE_MOCK, action);

        expect(state).toEqual({
          ...PROCESS_CASE_STATE_MOCK,
          addMaterials: {
            ...PROCESS_CASE_STATE_MOCK.addMaterials,
            addMaterialRowData: items,
          },
        });
      });
    });

    describe('pasteRowDataItemsToAddMaterial', () => {
      test('should paste RowDataItems to AddMaterial', () => {
        const items: MaterialTableItem[] = [];
        const action = pasteRowDataItemsToAddMaterial({
          items,
        });

        const fakeState = {
          ...PROCESS_CASE_STATE_MOCK,
          addMaterials: {
            ...PROCESS_CASE_STATE_MOCK.addMaterials,
            addMaterialRowData: items,
          },
        };

        const state = processCaseReducer(fakeState, action);

        expect(state).toEqual({
          ...PROCESS_CASE_STATE_MOCK,
          addMaterials: {
            ...PROCESS_CASE_STATE_MOCK.addMaterials,
            addMaterialRowData: [],
            validationLoading: true,
          },
        });
      });
    });
    describe('updateMaterialRowDataItem', () => {
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

        const fakeState: ProcessCaseState = {
          ...PROCESS_CASE_STATE_MOCK,
          addMaterials: {
            ...PROCESS_CASE_STATE_MOCK.addMaterials,
            addMaterialRowData: mockedRowData,
          },
        };
        const action = updateMaterialRowDataItem({ item });
        const state = processCaseReducer(fakeState, action);

        expect(state.addMaterials.addMaterialRowData).toEqual([
          item,
          mockedRowData[1],
        ]);
      });
    });
    describe('deleteAddMaterialRowDataItem', () => {
      test('should delete AddMaterialRowDataItem', () => {
        const materialNumber = '123465';
        const action = deleteAddMaterialRowDataItem({
          materialNumber,
          quantity: 100,
        });

        const fakeState = {
          ...PROCESS_CASE_STATE_MOCK,
          addMaterials: {
            ...PROCESS_CASE_STATE_MOCK.addMaterials,
            addMaterialRowData: [
              {
                materialNumber: '123465',
                quantity: 100,
              },
              {
                materialNumber: '987654',
                quantity: 100,
              },
            ],
          },
        };

        const state = processCaseReducer(fakeState, action);

        expect(state).toEqual({
          ...PROCESS_CASE_STATE_MOCK,
          addMaterials: {
            ...PROCESS_CASE_STATE_MOCK.addMaterials,
            addMaterialRowData: [
              {
                materialNumber: '987654',
                quantity: 100,
              },
            ],
          },
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
        const action = validateAddMaterialsSuccess({ materialValidations });

        const fakeState = {
          ...PROCESS_CASE_STATE_MOCK,
          addMaterials: {
            ...PROCESS_CASE_STATE_MOCK.addMaterials,
            addMaterialRowData: [
              {
                materialDescription: 'desc',
                materialNumber: '123465',
                quantity: 100,
              },
            ],
          },
        };
        const state = processCaseReducer(fakeState, action);

        expect(state).toEqual({
          ...PROCESS_CASE_STATE_MOCK,
          addMaterials: {
            ...PROCESS_CASE_STATE_MOCK.addMaterials,
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
          },
        });
      });
    });

    describe('validateAddMaterialsFailure', () => {
      test('should failed validation', () => {
        const action = validateAddMaterialsFailure({ errorMessage });

        const state = processCaseReducer(PROCESS_CASE_STATE_MOCK, action);

        expect(state).toEqual({
          ...PROCESS_CASE_STATE_MOCK,
          addMaterials: {
            ...PROCESS_CASE_STATE_MOCK.addMaterials,
            errorMessage,
            addMaterialRowData: [],
            validationLoading: false,
          },
        });
      });
    });

    describe('removePositions', () => {
      test('should set quotationLoading to true', () => {
        const gqPositionIds = ['12456'];

        const action = removePositions({ gqPositionIds });

        const state = processCaseReducer(PROCESS_CASE_STATE_MOCK, action);

        expect(state).toEqual({
          ...PROCESS_CASE_STATE_MOCK,
          addMaterials: {
            ...PROCESS_CASE_STATE_MOCK.addMaterials,
            removeQuotationDetailsIds: gqPositionIds,
          },
          quotation: {
            ...PROCESS_CASE_STATE_MOCK.quotation,
            updateLoading: true,
          },
        });
      });
    });

    describe('removePositionsSuccess', () => {
      test('should remove material', () => {
        const updatedQuotation = QUOTATION_MOCK;

        const fakeState = {
          ...PROCESS_CASE_STATE_MOCK,
          quotation: {
            ...PROCESS_CASE_STATE_MOCK.quotation,
            item: QUOTATION_MOCK,
          },
        };
        const action = removePositionsSuccess({ updatedQuotation });

        const state = processCaseReducer(fakeState, action);

        const stateItem = state.quotation;
        expect(stateItem.item.quotationDetails).toEqual([]);
      });
    });

    describe('removePositionsFailure', () => {
      test('should remove material', () => {
        const action = removePositionsFailure({ errorMessage });

        const fakeState = {
          ...PROCESS_CASE_STATE_MOCK,
          quotation: {
            ...PROCESS_CASE_STATE_MOCK.quotation,
          },
        };

        const state = processCaseReducer(fakeState, action);

        expect(state.quotation.quotationLoading).toBeFalsy();
        expect(state.quotation.errorMessage).toEqual(errorMessage);
      });
    });
  });
  describe('clearRowData', () => {
    test('should clearRowData', () => {
      const action = clearProcessCaseRowData();

      const state = processCaseReducer(PROCESS_CASE_STATE_MOCK, action);

      expect(state.addMaterials.addMaterialRowData).toEqual([]);
    });
  });
  describe('setSelectedQuotationDetail', () => {
    test('should set selectedQuotationDetail', () => {
      const gqPositionId = '1234';
      const action = setSelectedQuotationDetail({ gqPositionId });
      const fakeState = {
        ...PROCESS_CASE_STATE_MOCK,
      };
      const state = processCaseReducer(fakeState, action);

      expect(state.quotation.selectedQuotationDetail).toEqual(gqPositionId);
    });
  });
  describe('sapUpload', () => {
    describe('uploadSelectionToSap', () => {
      test('should set loading true', () => {
        const action = uploadSelectionToSap({ gqPositionIds: ['1'] });
        const state = processCaseReducer(PROCESS_CASE_STATE_MOCK, action);
        expect(state.quotation.updateLoading).toBeTruthy();
      });
    });
    describe('uploadSelectionToSapSuccess', () => {
      test('should set loading false', () => {
        const action = uploadSelectionToSapSuccess({
          updatedQuotation: QUOTATION_MOCK,
        });
        const state = processCaseReducer(PROCESS_CASE_STATE_MOCK, action);
        expect(state.quotation.updateLoading).toBeFalsy();
      });

      test('should update only updatedQuoationDetails', () => {
        const mockState = {
          ...PROCESS_CASE_STATE_MOCK,
          quotation: {
            ...PROCESS_CASE_STATE_MOCK.quotation,
            item: {
              ...PROCESS_CASE_STATE_MOCK.quotation.item,
              quotationDetails: [
                {
                  ...QUOTATION_DETAIL_MOCK,
                  gqPositionId: '123',
                  syncInSap: false,
                },
                {
                  ...QUOTATION_DETAIL_MOCK,
                  gqPositionId: '456',
                  syncInSap: false,
                },
                {
                  ...QUOTATION_DETAIL_MOCK,
                  gqPositionId: '789',
                  syncInSap: false,
                },
              ],
            },
          },
        };

        const action = uploadSelectionToSapSuccess({
          updatedQuotation: {
            ...QUOTATION_MOCK,
            sapCallInProgress: SapCallInProgress.MAINTAIN_QUOTATION_IN_PROGRESS,
            quotationDetails: [
              {
                ...QUOTATION_DETAIL_MOCK,
                gqPositionId: '456',
                syncInSap: true,
              },
            ],
          },
        });

        const state = processCaseReducer(mockState, action);

        expect(state.quotation.item.sapCallInProgress).toEqual(
          SapCallInProgress.MAINTAIN_QUOTATION_IN_PROGRESS
        );

        expect(state.quotation.item.quotationDetails).toEqual([
          {
            ...QUOTATION_DETAIL_MOCK,
            gqPositionId: '123',
            syncInSap: false,
          },
          {
            ...QUOTATION_DETAIL_MOCK,
            gqPositionId: '456',
            syncInSap: true,
          },
          {
            ...QUOTATION_DETAIL_MOCK,
            gqPositionId: '789',
            syncInSap: false,
          },
        ]);
      });
    });
    describe('uploadSelectionToSapFailure', () => {
      test('should set loading false', () => {
        const action = uploadSelectionToSapFailure({ errorMessage });
        const state = processCaseReducer(PROCESS_CASE_STATE_MOCK, action);
        expect(state.quotation.updateLoading).toBeFalsy();
        expect(state.quotation.errorMessage).toEqual(errorMessage);
      });
    });
  });

  describe('refreshSapPricing', () => {
    describe('refreshSapPricing', () => {
      test('should set loading true', () => {
        const action = refreshSapPricing();

        const state = processCaseReducer(PROCESS_CASE_STATE_MOCK, action);

        expect(state.quotation.updateLoading).toEqual(true);
      });
    });
    describe('refreshSapPricingSuccess', () => {
      test('should set quotation to response and loading to false', () => {
        const quotation = QUOTATION_MOCK;
        const action = refreshSapPricingSuccess({ quotation });
        const fakeState = {
          ...PROCESS_CASE_STATE_MOCK,
          quotation: {
            ...PROCESS_CASE_STATE_MOCK.quotation,
            updateLoading: true,
            item: undefined as any,
          },
        };
        const state = processCaseReducer(fakeState, action);

        expect(state.quotation.updateLoading).toEqual(false);
        expect(state.quotation.item).toEqual(QUOTATION_MOCK);
      });
    });
    describe('refreshSapPricingFailure', () => {
      test('should set error message and set loading to false', () => {
        const action = refreshSapPricingFailure({ errorMessage });
        const fakeState = {
          ...PROCESS_CASE_STATE_MOCK,
          quotation: {
            ...PROCESS_CASE_STATE_MOCK.quotation,
            updateLoading: true,
          },
        };
        const state = processCaseReducer(fakeState, action);

        expect(state.quotation.updateLoading).toEqual(false);
        expect(state.quotation.errorMessage).toEqual(errorMessage);
      });
    });
  });

  describe('updateQuotation Reducers', () => {
    describe('updateQuotation', () => {
      test('should set updateLoading true', () => {
        const action = updateQuotation({
          caseName: 'caseName',
          currency: 'EUR',
        });
        const state = processCaseReducer(PROCESS_CASE_STATE_MOCK, action);

        expect(state.quotation.quotationLoading).toBeTruthy();
      });
    });
    describe('updateQuotationSuccess', () => {
      test('should set updateLoading false and set quotation', () => {
        const quotation: Quotation = QUOTATION_MOCK;
        const action = updateQuotationSuccess({ quotation });
        const state = processCaseReducer(PROCESS_CASE_STATE_MOCK, action);

        expect(state.quotation.item).toEqual(quotation);
        expect(state.quotation.quotationLoading).toBeFalsy();
      });
    });
    describe('updateQuotationFailure', () => {
      test('should set updateLoading', () => {
        const action = updateQuotationFailure({ errorMessage });
        const state = processCaseReducer(PROCESS_CASE_STATE_MOCK, action);

        expect(state.quotation.quotationLoading).toBeFalsy();
        expect(state.quotation.errorMessage).toEqual(errorMessage);
      });
    });
  });
  describe('Reducer function', () => {
    test('should return searchReducer', () => {
      // prepare any action
      const action: Action = loadCustomer();
      expect(reducer(PROCESS_CASE_STATE_MOCK, action)).toEqual(
        processCaseReducer(PROCESS_CASE_STATE_MOCK, action)
      );
    });
  });

  describe('SimulatedQuotation', () => {
    test('should add new simulated quotation', () => {
      const action: Action = addSimulatedQuotation({
        gqId: 1234,
        quotationDetails: [QUOTATION_DETAIL_MOCK],
      });
      const state = processCaseReducer(
        {
          ...PROCESS_CASE_STATE_MOCK,
          quotation: {
            ...PROCESS_CASE_STATE_MOCK.quotation,
            simulatedItem: {
              ...SIMULATED_QUOTATION_MOCK,
              quotationDetails: [],
              previousStatusBar: undefined,
              simulatedStatusBar: undefined,
            },
          },
        },
        action
      );

      expect(state.quotation.simulatedItem).toEqual(SIMULATED_QUOTATION_MOCK);
    });

    test('should reset the simulated quotation', () => {
      const action: Action = resetSimulatedQuotation();
      const state = processCaseReducer(
        {
          ...PROCESS_CASE_STATE_MOCK,
          quotation: {
            ...PROCESS_CASE_STATE_MOCK.quotation,
            simulatedItem: SIMULATED_QUOTATION_MOCK,
          },
        },
        action
      );

      expect(state.quotation.simulatedItem).toEqual(undefined);
    });

    test('should not remove a non-existing quotation detail from a simulated quotation', () => {
      const simulatedQuotationDetails = [
        { ...QUOTATION_DETAIL_MOCK, gqPositionId: '111' },
        { ...QUOTATION_DETAIL_MOCK, gqPositionId: '222' },
      ];

      const action: Action = removeSimulatedQuotationDetail({
        gqPositionId: '666',
      });

      const state = processCaseReducer(
        {
          ...PROCESS_CASE_STATE_MOCK,
          quotation: {
            ...PROCESS_CASE_STATE_MOCK.quotation,
            simulatedItem: {
              ...SIMULATED_QUOTATION_MOCK,
              quotationDetails: simulatedQuotationDetails,
            },
          },
        },
        action
      );

      expect(state.quotation.simulatedItem.quotationDetails.length).toEqual(2);
      expect(
        state.quotation.simulatedItem.quotationDetails[0].gqPositionId
      ).toEqual('111');
      expect(
        state.quotation.simulatedItem.quotationDetails[1].gqPositionId
      ).toEqual('222');
    });

    test('should not remove a quotation detail from a simulated quotation', () => {
      const simulatedQuotationDetails = [
        { ...QUOTATION_DETAIL_MOCK, gqPositionId: '111' },
      ];

      const action: Action = removeSimulatedQuotationDetail({
        gqPositionId: '111',
      });

      const state = processCaseReducer(
        {
          ...PROCESS_CASE_STATE_MOCK,
          quotation: {
            ...PROCESS_CASE_STATE_MOCK.quotation,
            simulatedItem: {
              ...SIMULATED_QUOTATION_MOCK,
              quotationDetails: simulatedQuotationDetails,
            },
          },
        },
        action
      );

      expect(state.quotation.simulatedItem.quotationDetails).toEqual([]);
    });

    test('should remove a quotationDetail from a simulated quotation with multiple entries', () => {
      const simulatedQuotationDetails = [
        { ...QUOTATION_DETAIL_MOCK, gqPositionId: '111' },
        { ...QUOTATION_DETAIL_MOCK, gqPositionId: '222' },
      ];

      const action: Action = removeSimulatedQuotationDetail({
        gqPositionId: '222',
      });

      const state = processCaseReducer(
        {
          ...PROCESS_CASE_STATE_MOCK,
          quotation: {
            ...PROCESS_CASE_STATE_MOCK.quotation,
            simulatedItem: {
              ...SIMULATED_QUOTATION_MOCK,
              quotationDetails: simulatedQuotationDetails,
              simulatedStatusBar: {
                gpi: 1,
                gpm: 2,
                netValue: 2,
                priceDiff: 3,
                rows: 4,
              },
            },
          },
        },
        action
      );

      expect(state.quotation.simulatedItem.quotationDetails.length).toEqual(1);
      expect(
        state.quotation.simulatedItem.quotationDetails[0].gqPositionId
      ).toEqual('111');
      expect(state.quotation.simulatedItem.previousStatusBar).toEqual(
        SIMULATED_QUOTATION_MOCK.previousStatusBar
      );
    });
  });

  describe('case selection', () => {
    test('should select a quotation detail', () => {
      const action = selectQuotationDetail({ gqPositionId: '1234' });
      const state = processCaseReducer(PROCESS_CASE_STATE_MOCK, action);

      expect(state).toEqual({
        ...PROCESS_CASE_STATE_MOCK,
        quotation: {
          ...PROCESS_CASE_STATE_MOCK.quotation,
          selectedQuotationDetails: ['1234'],
        },
      });
    });

    test('should deselect a quotation detail', () => {
      const action = deselectQuotationDetail({ gqPositionId: '1234' });
      const state = processCaseReducer(
        {
          ...PROCESS_CASE_STATE_MOCK,
          quotation: {
            ...PROCESS_CASE_STATE_MOCK.quotation,
            selectedQuotationDetails: ['1234', '5678'],
          },
        },
        action
      );
      expect(state).toEqual({
        ...PROCESS_CASE_STATE_MOCK,
        quotation: {
          ...PROCESS_CASE_STATE_MOCK.quotation,
          selectedQuotationDetails: ['5678'],
        },
      });
    });
  });

  describe('CreateSapQuote', () => {
    test('handle CreateSapQuote and set quotationLoading true', () => {
      const action = createSapQuote({ gqPositionIds: ['12-12-12'] });
      const state = processCaseReducer(PROCESS_CASE_STATE_MOCK, action);
      expect(state.quotation.quotationLoading).toBe(true);
    });
    test('Handle CreateSapQuoteSuccess and update the quotation received by service', () => {
      const action = createSapQuoteSuccess({
        quotation: {
          ...QUOTATION_MOCK,
          sapCallInProgress: SapCallInProgress.FETCH_DATA_IN_PROGRESS,
        },
      });
      const state = processCaseReducer(PROCESS_CASE_STATE_MOCK, action);
      expect(state.quotation.quotationLoading).toBe(false);
      expect(state.quotation.item).toEqual({
        ...QUOTATION_MOCK,
        sapCallInProgress: SapCallInProgress.FETCH_DATA_IN_PROGRESS,
      });
    });
    test('Handle CreateSapQuoteFailure and set errorMessage', () => {
      const action = createSapQuoteFailure({ errorMessage });
      const state = processCaseReducer(PROCESS_CASE_STATE_MOCK, action);
      expect(state.quotation.quotationLoading).toBe(false);
      expect(state.quotation.item).toEqual({
        ...QUOTATION_MOCK,
      });
      expect(state.quotation.errorMessage).toBe(errorMessage);
    });
  });
});
// eslint-disable-next-line max-lines
