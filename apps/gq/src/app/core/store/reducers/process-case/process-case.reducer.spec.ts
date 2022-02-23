import { Action } from '@ngrx/store';

import {
  CUSTOMER_MOCK,
  PROCESS_CASE_STATE_MOCK,
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
  VIEW_QUOTATION_MOCK,
} from '../../../../../testing/mocks';
import { ViewQuotation } from '../../../../case-view/models/view-quotation.model';
import { Quotation } from '../../../../shared/models/';
import { PriceSource } from '../../../../shared/models/quotation-detail';
import {
  MaterialTableItem,
  MaterialValidation,
} from '../../../../shared/models/table';
import {
  addMaterialRowDataItem,
  addMaterials,
  addMaterialsFailure,
  addMaterialsSuccess,
  clearProcessCaseRowData,
  deleteAddMaterialRowDataItem,
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
  selectQuotation,
  setSelectedQuotationDetail,
  updateCaseName,
  updateCaseNameFailure,
  updateCaseNameSuccess,
  updateQuotationDetails,
  updateQuotationDetailsFailure,
  updateQuotationDetailsSuccess,
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
        const mockItem: Quotation = QUOTATION_MOCK;
        const quotationDetails = mockItem.quotationDetails;

        const action = updateQuotationDetailsSuccess({ quotationDetails });

        const fakeState = {
          ...PROCESS_CASE_STATE_MOCK,
          quotation: {
            ...PROCESS_CASE_STATE_MOCK.quotation,
            item: mockItem,
          },
        };

        const state = processCaseReducer(fakeState, action);

        const stateItem = state.quotation;
        expect(stateItem.item.quotationDetails[0]).toBeTruthy();
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
        const item = QUOTATION_MOCK;

        const fakeState = {
          ...PROCESS_CASE_STATE_MOCK,
          quotation: {
            ...PROCESS_CASE_STATE_MOCK.quotation,
            item: QUOTATION_MOCK,
          },
        };
        const action = addMaterialsSuccess({ item });
        const state = processCaseReducer(fakeState, action);

        const stateItem = state.quotation;
        expect(stateItem.item).toEqual(item);
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
        const item = QUOTATION_MOCK;

        const fakeState = {
          ...PROCESS_CASE_STATE_MOCK,
          quotation: {
            ...PROCESS_CASE_STATE_MOCK.quotation,
            item: QUOTATION_MOCK,
          },
        };
        const action = removePositionsSuccess({ item });

        const state = processCaseReducer(fakeState, action);

        const stateItem = state.quotation;
        expect(stateItem.item).toEqual(item);
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
        const action = uploadSelectionToSapSuccess();
        const state = processCaseReducer(PROCESS_CASE_STATE_MOCK, action);
        expect(state.quotation.updateLoading).toBeFalsy();
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

  describe('updateCaseName Reducers', () => {
    describe('updateCaseName', () => {
      test('should set updateLoading true', () => {
        const action = updateCaseName({ caseName: 'caseName' });
        const state = processCaseReducer(PROCESS_CASE_STATE_MOCK, action);

        expect(state.quotation.quotationLoading).toBeTruthy();
      });
    });
    describe('updateCaseNameSuccess', () => {
      test('should set updateLoading false and set quotation', () => {
        const quotation: ViewQuotation = VIEW_QUOTATION_MOCK;
        const action = updateCaseNameSuccess({ quotation });
        const state = processCaseReducer(PROCESS_CASE_STATE_MOCK, action);

        expect(state.quotation.quotationLoading).toBeFalsy();
        expect(state.quotation.item.caseName).toEqual(quotation.caseName);
        expect(state.quotation.item.gqLastUpdated).toEqual(
          quotation.gqLastUpdated
        );
        expect(state.quotation.item.gqCreatedByUser).toEqual(
          quotation.gqCreatedByUser
        );
      });
    });
    describe('updateCaseNameFailure', () => {
      test('should set updateLoading', () => {
        const action = updateCaseNameFailure({ errorMessage });
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
});
// eslint-disable-next-line max-lines
