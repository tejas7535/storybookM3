import {
  CUSTOMER_MOCK,
  QUOTATION_MOCK,
  QUOTATION_STATE_MOCK,
} from '../../../../../testing/mocks';
import {
  loadCustomer,
  loadCustomerFailure,
  loadCustomerSuccess,
  loadQuotation,
  loadQuotationFailure,
  loadQuotationSuccess,
} from '../../actions';
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
});
