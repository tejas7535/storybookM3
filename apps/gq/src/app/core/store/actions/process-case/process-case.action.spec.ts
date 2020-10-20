import { CUSTOMER_MOCK, QUOTATION_MOCK } from '../../../../../testing/mocks';
import {
  CaseActions,
  loadCustomer,
  loadCustomerFailure,
  loadCustomerSuccess,
  loadQuotation,
  loadQuotationFailure,
  loadQuotationSuccess,
} from './process-case.action';

describe('CaseActions', () => {
  let action: CaseActions;
  let errorMessage: string;

  beforeEach(() => {
    action = undefined;
    errorMessage = 'An error occured';
  });

  describe('Customer Details Actions', () => {
    test('customer', () => {
      action = loadCustomer();

      expect(action).toEqual({
        type: '[Case] Get Customer Details',
      });
    });

    test('customerSuccess', () => {
      const item = CUSTOMER_MOCK;

      action = loadCustomerSuccess({ item });

      expect(action).toEqual({
        item,
        type: '[Case] Get Customer Details Success',
      });
    });

    test('customerFailure', () => {
      action = loadCustomerFailure({ errorMessage });

      expect(action).toEqual({
        errorMessage,
        type: '[Case] Get Customer Details Failure',
      });
    });
  });
  describe('Quotation Details Actions', () => {
    test('quotation', () => {
      action = loadQuotation();

      expect(action).toEqual({
        type: '[Case] Get Quotation Details',
      });
    });

    test('quotationSuccess', () => {
      const item = QUOTATION_MOCK;

      action = loadQuotationSuccess({ item });

      expect(action).toEqual({
        item,
        type: '[Case] Get Quotation Details Success',
      });
    });

    test('quotationFailure', () => {
      action = loadQuotationFailure({ errorMessage });

      expect(action).toEqual({
        errorMessage,
        type: '[Case] Get Quotation Details Failure',
      });
    });
  });
});
