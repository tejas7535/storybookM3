import {
  CUSTOMER_DETAILS_MOCK,
  QUOTATION_DETAILS_MOCK,
} from '../../../../../testing/mocks';
import { initialState } from '../../reducers/quotation/quotation.reducers';
import * as quotationSelectors from './quotation.selectors';

describe('Search Selector', () => {
  const fakeState = {
    quotation: {
      ...initialState,
      customer: {
        ...initialState.customer,
        item: CUSTOMER_DETAILS_MOCK,
        customerDetailsLoading: true,
      },
      quotation: {
        ...initialState.quotation,
        items: [QUOTATION_DETAILS_MOCK],
        quotationDetailsLoading: true,
      },
    },
  };

  describe('getCustomer', () => {
    test('should return the customer details', () => {
      expect(
        quotationSelectors.getCustomer.projector(fakeState.quotation)
      ).toEqual(fakeState.quotation.customer.item);
    });
  });

  describe('getCustomerLoading', () => {
    test('should return true if customer details is currently loading', () => {
      expect(
        quotationSelectors.getCustomerLoading.projector(fakeState.quotation)
      ).toBeTruthy();
    });
  });

  describe('getQuotation', () => {
    test('should return all quotation details', () => {
      expect(
        quotationSelectors.getQuotation.projector(fakeState.quotation)
      ).toEqual(fakeState.quotation.quotation.items);
    });
  });

  describe('getQuotationLoading', () => {
    test('should return true if quotation is currently loading', () => {
      expect(
        quotationSelectors.getQuotationLoading.projector(fakeState.quotation)
      ).toBeTruthy();
    });
  });
});
