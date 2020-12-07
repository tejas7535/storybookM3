import {
  CUSTOMER_MOCK,
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
} from '../../../../../testing/mocks';
import {
  addMaterials,
  addQuotationDetailToOffer,
  CaseActions,
  loadCustomer,
  loadCustomerFailure,
  loadCustomerSuccess,
  loadQuotation,
  loadQuotationFailure,
  loadQuotationSuccess,
  removeQuotationDetailFromOffer,
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
        type: '[Process Case] Get Customer Details',
      });
    });

    test('customerSuccess', () => {
      const item = CUSTOMER_MOCK;

      action = loadCustomerSuccess({ item });

      expect(action).toEqual({
        item,
        type: '[Process Case] Get Customer Details Success',
      });
    });

    test('customerFailure', () => {
      action = loadCustomerFailure({ errorMessage });

      expect(action).toEqual({
        errorMessage,
        type: '[Process Case] Get Customer Details Failure',
      });
    });
  });

  describe('Quotation Details Actions', () => {
    test('quotation', () => {
      action = loadQuotation();

      expect(action).toEqual({
        type: '[Process Case] Get Quotation Details',
      });
    });

    test('quotationSuccess', () => {
      const item = QUOTATION_MOCK;

      action = loadQuotationSuccess({ item });

      expect(action).toEqual({
        item,
        type: '[Process Case] Get Quotation Details Success',
      });
    });

    test('quotationFailure', () => {
      action = loadQuotationFailure({ errorMessage });

      expect(action).toEqual({
        errorMessage,
        type: '[Process Case] Get Quotation Details Failure',
      });
    });

    test('', () => {
      action = addMaterials();

      expect(action).toEqual({
        type: '[Process Case] add material to Quotation',
      });
    });
  });

  describe('Offer Actions', () => {
    test('addQuotationDetailToOffer', () => {
      const quotationDetailIDs = [QUOTATION_DETAIL_MOCK.quotationItemId];
      action = addQuotationDetailToOffer({ quotationDetailIDs });

      expect(action).toEqual({
        quotationDetailIDs,
        type: '[Offer] add QuotationDetail to offer',
      });
    });

    test('removeQuotationDetailFromOffer', () => {
      const quotationDetailIDs = [QUOTATION_DETAIL_MOCK.quotationItemId];
      action = removeQuotationDetailFromOffer({ quotationDetailIDs });

      expect(action).toEqual({
        quotationDetailIDs,
        type: '[Offer] remove QuotationDetail to offer',
      });
    });
  });
});
