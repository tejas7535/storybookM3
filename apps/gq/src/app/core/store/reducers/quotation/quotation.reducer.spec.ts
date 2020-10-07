import {
  CUSTOMER_DETAILS_MOCK,
  QUOTATION_DETAILS_MOCK,
  QUOTATION_STATE_MOCK,
} from '../../../../../testing/mocks';
import {
  customerDetailsRequest,
  customerDetailsFailure,
  customerDetailsSuccess,
  quotationDetailsRequest,
  quotationDetailsFailure,
  quotationDetailsSuccess,
} from '../../actions';
import { quotationReducer } from './quotation.reducers';

describe('Quotation Reducer', () => {
  describe('customer', () => {
    describe('customerDetails', () => {
      test('should set customerDetails loading', () => {
        const customerNumber = '123456';
        const action = customerDetailsRequest({ customerNumber });
        const state = quotationReducer(QUOTATION_STATE_MOCK, action);

        expect(state).toEqual({
          ...QUOTATION_STATE_MOCK,
          customer: {
            ...QUOTATION_STATE_MOCK.customer,
            customerDetailsLoading: true,
          },
        });
      });
    });

    describe('customerDetailsSuccess', () => {
      test('should set customer details', () => {
        const customerDetails = CUSTOMER_DETAILS_MOCK;

        const fakeState = {
          ...QUOTATION_STATE_MOCK,
          customer: {
            ...QUOTATION_STATE_MOCK.customer,
            item: CUSTOMER_DETAILS_MOCK,
          },
        };
        const action = customerDetailsSuccess({ customerDetails });
        const state = quotationReducer(fakeState, action);

        const stateItem = state.customer;
        expect(stateItem.item).toEqual(customerDetails);
      });
    });

    describe('customerDetailsFailure', () => {
      test('should not manipulate state', () => {
        const action = customerDetailsFailure();
        const state = quotationReducer(QUOTATION_STATE_MOCK, action);

        expect(state).toEqual(QUOTATION_STATE_MOCK);
      });
    });
  });

  describe('quotation', () => {
    describe('quotationDetails', () => {
      test('should set quotationDetails loading', () => {
        const quotationNumber = '123456';
        const action = quotationDetailsRequest({ quotationNumber });
        const state = quotationReducer(QUOTATION_STATE_MOCK, action);

        expect(state).toEqual({
          ...QUOTATION_STATE_MOCK,
          quotation: {
            ...QUOTATION_STATE_MOCK.quotation,
            quotationDetailsLoading: true,
          },
        });
      });
    });

    describe('quotationDetailsSuccess', () => {
      test('should set quotation details', () => {
        const quotationDetails = [QUOTATION_DETAILS_MOCK];

        const fakeState = {
          ...QUOTATION_STATE_MOCK,
          quotation: {
            ...QUOTATION_STATE_MOCK.quotation,
            item: QUOTATION_DETAILS_MOCK,
          },
        };
        const action = quotationDetailsSuccess({ quotationDetails });
        const state = quotationReducer(fakeState, action);

        const stateItem = state.quotation;
        expect(stateItem.items).toEqual(quotationDetails);
      });
    });

    describe('quotationDetailsFailure', () => {
      test('should not manipulate state', () => {
        const action = quotationDetailsFailure();
        const state = quotationReducer(QUOTATION_STATE_MOCK, action);

        expect(state).toEqual(QUOTATION_STATE_MOCK);
      });
    });
  });
});
