import {
  CUSTOMER_MOCK,
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
} from '../../../../../testing/mocks';
import {
  addMaterials,
  CaseActions,
  loadCustomer,
  loadCustomerFailure,
  loadCustomerSuccess,
  loadQuotation,
  loadQuotationFailure,
  loadQuotationSuccess,
  setSelectedQuotationDetail,
  updateQuotationDetails,
  updateQuotationDetailsFailure,
  updateQuotationDetailsSuccess,
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
        type: '[Process Case] Add material to Quotation',
      });
    });
  });

  describe('Offer Actions', () => {
    test('updateQuotationDetails', () => {
      const quotationDetailIDs = [
        {
          gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
          addedToOffer: true,
        },
      ];
      action = updateQuotationDetails({ quotationDetailIDs });

      expect(action).toEqual({
        quotationDetailIDs,
        type: '[Offer] Update QuotationDetails',
      });
    });

    test('updateQuotationDetailsSuccess', () => {
      const quotationDetailIDs = [
        {
          gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
          addedToOffer: false,
        },
      ];
      action = updateQuotationDetailsSuccess({ quotationDetailIDs });

      expect(action).toEqual({
        quotationDetailIDs,
        type: '[Offer] Update QuotationDetails Success',
      });
    });

    test('updateQuotationDetailsFailure', () => {
      action = updateQuotationDetailsFailure({ errorMessage });

      expect(action).toEqual({
        errorMessage,
        type: '[Offer] Update QuotationDetails Failure',
      });
    });

    test('updateQuotationDetailsFailure', () => {
      action = updateQuotationDetailsFailure({ errorMessage });

      expect(action).toEqual({
        errorMessage,
        type: '[Offer] Update QuotationDetails Failure',
      });
    });

    test('setSelectedQuotationDetail', () => {
      const gqPositionId = '1234';
      action = setSelectedQuotationDetail({ gqPositionId });

      expect(action).toEqual({
        gqPositionId,
        type: '[Process Case] Set Selected GqPositionId',
      });
    });
  });
});
