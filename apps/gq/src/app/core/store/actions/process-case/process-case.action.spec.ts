import {
  CUSTOMER_MOCK,
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
} from '../../../../../testing/mocks';
import {
  addMaterials,
  CaseActions,
  deleteAddMaterialRowDataItem,
  loadCustomer,
  loadCustomerFailure,
  loadCustomerSuccess,
  loadQuotation,
  loadQuotationFailure,
  loadQuotationFromUrl,
  loadQuotationSuccess,
  loadSelectedQuotationDetailFromUrl,
  setSelectedQuotationDetail,
  updateQuotationDetails,
  updateQuotationDetailsFailure,
  updateQuotationDetailsSuccess,
  uploadOfferToSap,
  uploadOfferToSapFailure,
  uploadOfferToSapSuccess,
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

    test('addMaterials', () => {
      action = addMaterials();

      expect(action).toEqual({
        type: '[Process Case] Add material to Quotation',
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
    test('loadSelectedQuotationDetailFromUrl', () => {
      const gqPositionId = '1234';
      action = loadSelectedQuotationDetailFromUrl({ gqPositionId });

      expect(action).toEqual({
        gqPositionId,
        type: '[Process Case] Load selected quotation detail from URL',
      });
    });
    test('loadQuotationFromUrl', () => {
      const queryParams = {};
      action = loadQuotationFromUrl({ queryParams });

      expect(action).toEqual({
        queryParams,
        type: '[Process Case] Load quotation from URL',
      });
    });
  });

  describe('Offer Actions', () => {
    test('updateQuotationDetails', () => {
      const updateQuotationDetailList = [
        {
          gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
          addedToOffer: true,
        },
      ];
      action = updateQuotationDetails({ updateQuotationDetailList });

      expect(action).toEqual({
        updateQuotationDetailList,
        type: '[Offer] Update QuotationDetails',
      });
    });

    test('updateQuotationDetailsSuccess', () => {
      const quotationDetails = QUOTATION_MOCK.quotationDetails;
      action = updateQuotationDetailsSuccess({ quotationDetails });

      expect(action).toEqual({
        quotationDetails,
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

    test('uploadOfferToSap', () => {
      action = uploadOfferToSap();

      expect(action).toEqual({
        type: '[Process Case] Upload offer to Sap',
      });
    });
    test('uploadOfferToSapFailure', () => {
      action = uploadOfferToSapFailure({ errorMessage });

      expect(action).toEqual({
        errorMessage,
        type: '[Process Case] Upload offer to Sap Failure',
      });
    });
    test('uploadOfferToSapSuccess', () => {
      action = uploadOfferToSapSuccess();

      expect(action).toEqual({
        type: '[Process Case] Upload offer to Sap Success',
      });
    });
  });

  describe('Row Data Actions', () => {
    test('deleteAddMaterialRowDataItem', () => {
      const materialNumber = '12345';
      const quantity = 10;

      action = deleteAddMaterialRowDataItem({ materialNumber, quantity });

      expect(action).toEqual({
        materialNumber,
        quantity,
        type: '[Process Case] Delete Item from Material Table',
      });
    });
  });
});
