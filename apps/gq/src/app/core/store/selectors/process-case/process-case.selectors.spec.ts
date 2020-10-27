import { CUSTOMER_MOCK, QUOTATION_MOCK } from '../../../../../testing/mocks';
import { initialState } from '../../reducers/process-case/process-case.reducers';
import * as quotationSelectors from './process-case.selectors';

describe('Process Case Selector', () => {
  const fakeState = {
    processCase: {
      ...initialState,
      customer: {
        ...initialState.customer,
        item: CUSTOMER_MOCK,
        customerLoading: true,
      },
      quotation: {
        ...initialState.quotation,
        item: QUOTATION_MOCK,
        quotationLoading: true,
      },
    },
  };

  describe('getCustomer', () => {
    test('should return the customer details', () => {
      expect(
        quotationSelectors.getCustomer.projector(fakeState.processCase)
      ).toEqual(fakeState.processCase.customer.item);
    });
  });

  describe('getCustomerLoading', () => {
    test('should return true if customer details is currently loading', () => {
      expect(
        quotationSelectors.getCustomerLoading.projector(fakeState.processCase)
      ).toBeTruthy();
    });
  });

  describe('getQuotation', () => {
    test('should return all quotation details', () => {
      expect(
        quotationSelectors.getQuotation.projector(fakeState.processCase)
      ).toEqual(fakeState.processCase.quotation.item);
    });
  });

  describe('getQuotationLoading', () => {
    test('should return true if quotation is currently loading', () => {
      expect(
        quotationSelectors.getQuotationLoading.projector(fakeState.processCase)
      ).toBeTruthy();
    });
  });

  describe('getOffer', () => {
    test('should return true if quotation is currently loading', () => {
      expect(
        quotationSelectors.getOffer.projector(fakeState.processCase)
      ).toBeTruthy();
    });
  });
});
