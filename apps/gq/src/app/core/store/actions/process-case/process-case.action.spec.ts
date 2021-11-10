import {
  refreshSapPricing,
  refreshSapPricingFailure,
  refreshSapPricingSuccess,
} from '..';
import {
  CUSTOMER_MOCK,
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
} from '../../../../../testing/mocks';
import {
  addMaterials,
  CaseActions,
  clearProcessCaseRowData,
  deleteAddMaterialRowDataItem,
  loadCustomer,
  loadCustomerFailure,
  loadCustomerSuccess,
  loadQuotation,
  loadQuotationFailure,
  loadQuotationFromUrl,
  loadQuotationSuccess,
  loadSelectedQuotationDetailFromUrl,
  removePositions,
  removePositionsFailure,
  removePositionsSuccess,
  setSelectedQuotationDetail,
  updateQuotationDetails,
  updateQuotationDetailsFailure,
  updateQuotationDetailsSuccess,
  uploadSelectionToSap,
  uploadSelectionToSapFailure,
  uploadSelectionToSapSuccess,
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

    test('clearRowData', () => {
      action = clearProcessCaseRowData();

      expect(action).toEqual({
        type: '[Process Case] Clear RowData',
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

  describe('updateQuotationDetails Actions', () => {
    test('updateQuotationDetails', () => {
      const updateQuotationDetailList = [
        {
          gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
          price: 20,
        },
      ];
      action = updateQuotationDetails({ updateQuotationDetailList });

      expect(action).toEqual({
        updateQuotationDetailList,
        type: '[Process Case] Update QuotationDetails',
      });
    });

    test('updateQuotationDetailsSuccess', () => {
      const quotationDetails = QUOTATION_MOCK.quotationDetails;
      action = updateQuotationDetailsSuccess({ quotationDetails });

      expect(action).toEqual({
        quotationDetails,
        type: '[Process Case] Update QuotationDetails Success',
      });
    });

    test('updateQuotationDetailsFailure', () => {
      action = updateQuotationDetailsFailure({ errorMessage });

      expect(action).toEqual({
        errorMessage,
        type: '[Process Case] Update QuotationDetails Failure',
      });
    });

    test('uploadSelectionToSap', () => {
      action = uploadSelectionToSap({ gqPositionIds: ['1'] });

      expect(action).toEqual({
        gqPositionIds: ['1'],
        type: '[Process Case] Upload selection to Sap',
      });
    });
    test('uploadSelectionToSapFailure', () => {
      action = uploadSelectionToSapFailure({ errorMessage });

      expect(action).toEqual({
        errorMessage,
        type: '[Process Case] Upload selection to Sap Failure',
      });
    });
    test('uploadSelectionToSapSuccess', () => {
      action = uploadSelectionToSapSuccess();

      expect(action).toEqual({
        type: '[Process Case] Upload selection to Sap Success',
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

  describe('removePositions Actions', () => {
    describe('removePositions', () => {
      test('should removePositions', () => {
        const gqPositionIds = ['1'];
        action = removePositions({ gqPositionIds });

        expect(action).toEqual({
          gqPositionIds,
          type: '[Process Case] Remove positions from Quotation',
        });
      });
    });
    describe('removePositionsSuccess', () => {
      test('should removePositionsSuccess', () => {
        const item = QUOTATION_MOCK;
        action = removePositionsSuccess({ item });

        expect(action).toEqual({
          item,
          type: '[Process Case] Remove positions from Quotation Success',
        });
      });
    });
    describe('removePositionsFailure', () => {
      test('should removePositionsFailure', () => {
        action = removePositionsFailure({ errorMessage });

        expect(action).toEqual({
          errorMessage,
          type: '[Process Case] Remove positions from Quotation Failure',
        });
      });
    });
    describe('refreshSapPricing', () => {
      test('should refreshSapPricing', () => {
        action = refreshSapPricing();

        expect(action).toEqual({
          type: '[Process Case] Refresh SAP Pricing',
        });
      });
    });
    describe('refreshSapPricingSuccess', () => {
      test('should refreshSapPricingSuccess', () => {
        const quotation = QUOTATION_MOCK;
        action = refreshSapPricingSuccess({ quotation });

        expect(action).toEqual({
          quotation,
          type: '[Process Case] Refresh SAP Pricing Success',
        });
      });
    });
    describe('refreshSapPricingFailure', () => {
      test('should refreshSapPricingSuccess', () => {
        action = refreshSapPricingFailure({ errorMessage });

        expect(action).toEqual({
          errorMessage,
          type: '[Process Case] Refresh SAP Pricing Failure',
        });
      });
    });
  });
});
