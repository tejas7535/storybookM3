import {
  CUSTOMER_DETAILS_MOCK,
  QUOTATION_DETAILS_MOCK,
} from '../../../../../testing/mocks';
import {
  customerDetailsRequest,
  customerDetailsFailure,
  customerDetailsSuccess,
  quotationDetailsRequest,
  quotationDetailsFailure,
  quotationDetailsSuccess,
} from './quotation.action';

describe('CaseActions', () => {
  describe('Customer Details Actions', () => {
    test('customerDetails', () => {
      const customerNumber = '123456';

      const action = customerDetailsRequest({ customerNumber });

      expect(action).toEqual({
        customerNumber,
        type: '[Case] Get Customer Details',
      });
    });

    test('customerDetailsSuccess', () => {
      const customerDetails = CUSTOMER_DETAILS_MOCK;

      const action = customerDetailsSuccess({ customerDetails });

      expect(action).toEqual({
        customerDetails,
        type: '[Case] Get Customer Details Success',
      });
    });

    test('customerDetailsFailure', () => {
      const action = customerDetailsFailure();

      expect(action).toEqual({
        type: '[Case] Get Customer Details Failure',
      });
    });
  });
  describe('Quotation Details Actions', () => {
    test('quotationDetails', () => {
      const quotationNumber = '123456';

      const action = quotationDetailsRequest({ quotationNumber });

      expect(action).toEqual({
        quotationNumber,
        type: '[Case] Get Quotation Details',
      });
    });

    test('quotationDetailsSuccess', () => {
      const quotationDetails = [QUOTATION_DETAILS_MOCK];

      const action = quotationDetailsSuccess({ quotationDetails });

      expect(action).toEqual({
        quotationDetails,
        type: '[Case] Get Quotation Details Success',
      });
    });

    test('quotationDetailsFailure', () => {
      const action = quotationDetailsFailure();

      expect(action).toEqual({
        type: '[Case] Get Quotation Details Failure',
      });
    });
  });
});
