import {
  CUSTOMER_MOCK,
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
  QUOTATION_STATE_MOCK,
} from '../../../../../testing/mocks';
import {
  addMaterialRowDataItem,
  addMaterials,
  addMaterialsFailure,
  addMaterialsSuccess,
  addQuotationDetailToOffer,
  addToRemoveMaterials,
  deleteAddMaterialRowDataItem,
  loadCustomer,
  loadCustomerFailure,
  loadCustomerSuccess,
  loadQuotation,
  loadQuotationFailure,
  loadQuotationSuccess,
  pasteRowDataItemsToAddMaterial,
  removeMaterialsFailure,
  removeMaterialsSuccess,
  removeQuotationDetailFromOffer,
  selectQuotation,
  validateAddMaterialsFailure,
  validateAddMaterialsSuccess,
} from '../../actions';
import {
  MaterialTableItem,
  MaterialValidation,
  Quotation,
  QuotationIdentifier,
  QuotationInfoEnum,
} from '../../models';
import { processCaseReducer } from './process-case.reducer';

describe('Quotation Reducer', () => {
  const errorMessage = 'An error occured';

  describe('customer', () => {
    describe('customerDetails', () => {
      test('should set customerDetails loading', () => {
        const action = loadCustomer();
        const state = processCaseReducer(QUOTATION_STATE_MOCK, action);

        expect(state).toEqual({
          ...QUOTATION_STATE_MOCK,
          customer: {
            ...QUOTATION_STATE_MOCK.customer,
            customerLoading: true,
          },
        });
      });
    });

    describe('customerDetailsSuccess', () => {
      test('should set customer details', () => {
        const item = CUSTOMER_MOCK;

        const fakeState = {
          ...QUOTATION_STATE_MOCK,
          customer: {
            ...QUOTATION_STATE_MOCK.customer,
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
          ...QUOTATION_STATE_MOCK,
          customer: {
            ...QUOTATION_STATE_MOCK.customer,
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
        const quotationIdentifier: QuotationIdentifier = {
          quotationNumber: '123',
          customerNumber: '456',
        };
        const action = selectQuotation({ quotationIdentifier });
        const state = processCaseReducer(QUOTATION_STATE_MOCK, action);

        expect(state).toEqual({
          ...QUOTATION_STATE_MOCK,
          quotationIdentifier,
        });
      });
    });

    describe('quotationDetails', () => {
      test('should set quotationDetails loading', () => {
        const action = loadQuotation();
        const state = processCaseReducer(QUOTATION_STATE_MOCK, action);

        expect(state).toEqual({
          ...QUOTATION_STATE_MOCK,
          quotation: {
            ...QUOTATION_STATE_MOCK.quotation,
            quotationLoading: true,
          },
        });
      });
    });

    describe('quotationDetailsSuccess', () => {
      test('should set quotation details', () => {
        const item = QUOTATION_MOCK;

        const fakeState = {
          ...QUOTATION_STATE_MOCK,
          quotation: {
            ...QUOTATION_STATE_MOCK.quotation,
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
          ...QUOTATION_STATE_MOCK,
          quotation: {
            ...QUOTATION_STATE_MOCK.quotation,
          },
        };

        const state = processCaseReducer(fakeState, action);

        expect(state.quotation.quotationLoading).toBeFalsy();
        expect(state.quotation.errorMessage).toEqual(errorMessage);
      });
    });
  });

  describe('offer', () => {
    describe('addQuotationDetailToOffer', () => {
      test('should add a quotationDetail to Offer', () => {
        const action = addQuotationDetailToOffer({
          quotationDetailIDs: [QUOTATION_DETAIL_MOCK.gqPositionId],
        });
        const mockItem: Quotation = JSON.parse(JSON.stringify(QUOTATION_MOCK));

        const otherMockDetail = JSON.parse(
          JSON.stringify(QUOTATION_DETAIL_MOCK)
        );
        otherMockDetail.gqPositionId = 1234;
        mockItem.quotationDetails.push(otherMockDetail);
        expect(mockItem.quotationDetails.length).toEqual(2);

        const fakeState = {
          ...QUOTATION_STATE_MOCK,
          quotation: {
            ...QUOTATION_STATE_MOCK.quotation,
            item: mockItem,
          },
        };

        const state = processCaseReducer(fakeState, action);

        const stateItem = state.quotation;
        const addedDetail = stateItem.item.quotationDetails[0];
        const otherDetail = stateItem.item.quotationDetails[1];

        expect(addedDetail.info).toEqual(QuotationInfoEnum.AddedToOffer);
        expect(otherDetail.info).toEqual(QuotationInfoEnum.None);
      });
    });

    describe('removeQuotationDetailFromOffer', () => {
      test('should remove a quotationDetail from Offer', () => {
        const quotationDetailToRemove = QUOTATION_DETAIL_MOCK;
        quotationDetailToRemove.info = QuotationInfoEnum.AddedToOffer;
        const action = removeQuotationDetailFromOffer({
          quotationDetailIDs: [quotationDetailToRemove.gqPositionId],
        });
        const mockItem = JSON.parse(JSON.stringify(QUOTATION_MOCK));

        const otherMockDetail = JSON.parse(
          JSON.stringify(QUOTATION_DETAIL_MOCK)
        );
        otherMockDetail.gqPositionId = 1234;
        mockItem.quotationDetails.push(otherMockDetail);
        expect(mockItem.quotationDetails.length).toEqual(2);

        const fakeState = {
          ...QUOTATION_STATE_MOCK,
          quotation: {
            ...QUOTATION_STATE_MOCK.quotation,
            item: mockItem,
          },
        };

        const state = processCaseReducer(fakeState, action);

        const stateItem = state.quotation;
        const addedDetail = stateItem.item.quotationDetails[0];
        const otherDetail = stateItem.item.quotationDetails[1];

        expect(addedDetail.info).toEqual(QuotationInfoEnum.None);
        expect(otherDetail.info).toEqual(QuotationInfoEnum.AddedToOffer);
      });
    });
  });

  describe('Adding Materials', () => {
    describe('addMaterials', () => {
      test('should set dialog Shown to true', () => {
        const action = addMaterials();

        const state = processCaseReducer(QUOTATION_STATE_MOCK, action);

        expect(state).toEqual({
          ...QUOTATION_STATE_MOCK,
          quotation: {
            ...QUOTATION_STATE_MOCK.quotation,
            quotationLoading: true,
          },
        });
      });
    });

    describe('addMaterialsSuccess', () => {
      test('should set dialog Shown to true', () => {
        const item = QUOTATION_MOCK;

        const fakeState = {
          ...QUOTATION_STATE_MOCK,
          quotation: {
            ...QUOTATION_STATE_MOCK.quotation,
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
          ...QUOTATION_STATE_MOCK,
          quotation: {
            ...QUOTATION_STATE_MOCK.quotation,
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
        const state = processCaseReducer(QUOTATION_STATE_MOCK, action);

        expect(state).toEqual({
          ...QUOTATION_STATE_MOCK,
          addMaterials: {
            ...QUOTATION_STATE_MOCK.addMaterials,
            addMaterialRowData: items,
          },
        });
      });
    });

    describe('pasteRowDataItemsToAddMaterial', () => {
      test('should paste RowDataItems to AddMaterial', () => {
        const items: MaterialTableItem[] = [];
        const pasteDestination: MaterialTableItem = {
          materialNumber: '123465',
          quantity: 100,
        };
        const action = pasteRowDataItemsToAddMaterial({
          items,
          pasteDestination,
        });

        const fakeState = {
          ...QUOTATION_STATE_MOCK,
          addMaterials: {
            ...QUOTATION_STATE_MOCK.addMaterials,
            addMaterialRowData: items,
          },
        };

        const state = processCaseReducer(fakeState, action);

        expect(state).toEqual({
          ...QUOTATION_STATE_MOCK,
          addMaterials: {
            ...QUOTATION_STATE_MOCK.addMaterials,
            addMaterialRowData: [],
            validationLoading: true,
          },
        });
      });
    });

    describe('deleteAddMaterialRowDataItem', () => {
      test('should delete AddMaterialRowDataItem', () => {
        const materialNumber = '123465';
        const action = deleteAddMaterialRowDataItem({ materialNumber });

        const fakeState = {
          ...QUOTATION_STATE_MOCK,
          addMaterials: {
            ...QUOTATION_STATE_MOCK.addMaterials,
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
          ...QUOTATION_STATE_MOCK,
          addMaterials: {
            ...QUOTATION_STATE_MOCK.addMaterials,
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
          { materialNumber15: '123465', valid: true },
        ];
        const action = validateAddMaterialsSuccess({ materialValidations });

        const fakeState = {
          ...QUOTATION_STATE_MOCK,
          addMaterials: {
            ...QUOTATION_STATE_MOCK.addMaterials,
            addMaterialRowData: [
              {
                materialNumber: '123465',
                quantity: 100,
              },
            ],
          },
        };
        const state = processCaseReducer(fakeState, action);

        expect(state).toEqual({
          ...QUOTATION_STATE_MOCK,
          addMaterials: {
            ...QUOTATION_STATE_MOCK.addMaterials,
            addMaterialRowData: [
              {
                materialNumber: '123465',
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

        const state = processCaseReducer(QUOTATION_STATE_MOCK, action);

        expect(state).toEqual({
          ...QUOTATION_STATE_MOCK,
          addMaterials: {
            ...QUOTATION_STATE_MOCK.addMaterials,
            errorMessage,
            addMaterialRowData: [
              {
                materialNumber: '0167187...',
                quantity: '123...',
                info: {
                  description: ['validationFailure'],
                  valid: false,
                },
              },
            ],
            validationLoading: false,
          },
        });
      });
    });

    describe('addToRemoveMaterials', () => {
      test('should remove material', () => {
        const gqPositionIds = ['12456'];
        const action = addToRemoveMaterials({ gqPositionIds });

        const state = processCaseReducer(QUOTATION_STATE_MOCK, action);

        expect(state).toEqual({
          ...QUOTATION_STATE_MOCK,
          addMaterials: {
            ...QUOTATION_STATE_MOCK.addMaterials,
            removeQuotationDetailsIds: gqPositionIds,
          },
        });
      });
    });

    describe('removeMaterialsSuccess', () => {
      test('should remove material', () => {
        const item = QUOTATION_MOCK;

        const fakeState = {
          ...QUOTATION_STATE_MOCK,
          quotation: {
            ...QUOTATION_STATE_MOCK.quotation,
            item: QUOTATION_MOCK,
          },
        };
        const action = removeMaterialsSuccess({ item });

        const state = processCaseReducer(fakeState, action);

        const stateItem = state.quotation;
        expect(stateItem.item).toEqual(item);
      });
    });

    describe('removeMaterialsFailure', () => {
      test('should remove material', () => {
        const action = removeMaterialsFailure({ errorMessage });

        const fakeState = {
          ...QUOTATION_STATE_MOCK,
          quotation: {
            ...QUOTATION_STATE_MOCK.quotation,
          },
        };

        const state = processCaseReducer(fakeState, action);

        expect(state.quotation.quotationLoading).toBeFalsy();
        expect(state.quotation.errorMessage).toEqual(errorMessage);
      });
    });
  });
});
// tslint:disable-next-line: max-file-line-count
