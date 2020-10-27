import {
  CUSTOMER_MOCK,
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
  QUOTATION_STATE_MOCK,
} from '../../../../../testing/mocks';
import {
  addQuotationDetailToOffer,
  loadCustomer,
  loadCustomerFailure,
  loadCustomerSuccess,
  loadQuotation,
  loadQuotationFailure,
  loadQuotationSuccess,
  removeQuotationDetailFromOffer,
} from '../../actions';
import { Quotation, QuotationInfoEnum } from '../../models';
import { processCaseReducer } from './process-case.reducers';

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
          quotationDetailIDs: [QUOTATION_DETAIL_MOCK.quotationItemId],
        });
        const mockItem: Quotation = JSON.parse(JSON.stringify(QUOTATION_MOCK));

        const otherMockDetail = JSON.parse(
          JSON.stringify(QUOTATION_DETAIL_MOCK)
        );
        otherMockDetail.quotationItemId = 1234;
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
          quotationDetailIDs: [quotationDetailToRemove.quotationItemId],
        });
        const mockItem = JSON.parse(JSON.stringify(QUOTATION_MOCK));

        const otherMockDetail = JSON.parse(
          JSON.stringify(QUOTATION_DETAIL_MOCK)
        );
        otherMockDetail.quotationItemId = 1234;
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
});
