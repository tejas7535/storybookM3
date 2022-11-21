import {
  CUSTOMER_MOCK,
  QUOTATION_DETAIL_MOCK,
  QUOTATION_DETAILS_MOCK,
  QUOTATION_MOCK,
} from '../../../../../testing/mocks';
import {
  refreshSapPricing,
  refreshSapPricingFailure,
  refreshSapPricingSuccess,
} from '..';
import {
  addMaterials,
  addSimulatedQuotation,
  CaseActions,
  clearProcessCaseRowData,
  confirmSimulatedQuotation,
  deleteAddMaterialRowDataItem,
  deselectQuotationDetail,
  loadCustomer,
  loadCustomerFailure,
  loadCustomerSuccess,
  loadQuotation,
  loadQuotationFailure,
  loadQuotationFromUrl,
  loadQuotationInInterval,
  loadQuotationSuccess,
  loadQuotationSuccessFullyCompleted,
  loadSelectedQuotationDetailFromUrl,
  removePositions,
  removePositionsFailure,
  removePositionsSuccess,
  removeSimulatedQuotationDetail,
  resetSimulatedQuotation,
  selectQuotationDetail,
  setSelectedQuotationDetail,
  updateQuotation,
  updateQuotationDetails,
  updateQuotationDetailsFailure,
  updateQuotationDetailsSuccess,
  updateQuotationFailure,
  updateQuotationSuccess,
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
    test('loadQuotationInInterval', () => {
      action = loadQuotationInInterval();

      expect(action).toEqual({
        type: '[Process Case] Get Quotation in Interval',
      });
    });
    test('loadQuotation', () => {
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

    test('loadQuotationSuccessFullyCompleted', () => {
      action = loadQuotationSuccessFullyCompleted();

      expect(action).toEqual({
        type: '[Process Case] Get Quotation Details with Calculation Completed',
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
      const updatedQuotation = QUOTATION_MOCK;
      action = updateQuotationDetailsSuccess({ updatedQuotation });

      expect(action).toEqual({
        updatedQuotation,
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
      action = uploadSelectionToSapSuccess({
        updatedQuotation: QUOTATION_MOCK,
      });

      expect(action).toEqual({
        updatedQuotation: QUOTATION_MOCK,
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
        const updatedQuotation = QUOTATION_MOCK;
        action = removePositionsSuccess({ updatedQuotation });

        expect(action).toEqual({
          updatedQuotation,
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

  describe('updateQuotation Actions', () => {
    describe('updateQuotation', () => {
      test('should updateQuotation', () => {
        const caseName = 'name';
        const currency = 'EUR';
        action = updateQuotation({ caseName, currency });

        expect(action).toEqual({
          caseName,
          currency,
          type: '[Process Case] Update Quotation',
        });
      });
    });
    describe('updateQuotationSuccess', () => {
      test('should updateQuotationSuccess', () => {
        const quotation = QUOTATION_MOCK;
        action = updateQuotationSuccess({ quotation });

        expect(action).toEqual({
          quotation,
          type: '[Process Case] Update Quotation Success',
        });
      });
    });
    describe('updateQuotationFailure', () => {
      test('should updateQuotationFailure', () => {
        action = updateQuotationFailure({ errorMessage });

        expect(action).toEqual({
          errorMessage,
          type: '[Process Case] Update Quotation Failure',
        });
      });
    });
  });

  describe('SimulatedQuotation Actions', () => {
    test('should add simulated Quotation', () => {
      const gqId = 123;
      const quotationDetails = QUOTATION_DETAILS_MOCK;
      action = addSimulatedQuotation({
        gqId,
        quotationDetails,
      });

      expect(action).toEqual({
        gqId,
        quotationDetails,
        type: '[Process Case] Add Simulated Quotation',
      });
    });

    test('should reset simulated quotation action', () => {
      action = resetSimulatedQuotation();

      expect(action).toEqual({
        type: '[Process Case] Reset Simulated Quotation',
      });
    });

    test('should remove simulated quotationDetail action', () => {
      action = removeSimulatedQuotationDetail({
        gqPositionId: '123',
      });

      expect(action).toEqual({
        gqPositionId: '123',
        type: '[Process Case] Remove simulated QuotationDetail',
      });
    });

    test('should confirm simulated quotation', () => {
      action = confirmSimulatedQuotation();

      expect(action).toEqual({
        type: '[Process Case] Confirm Simulated Quotation',
      });
    });

    test('should select QuotationDetail', () => {
      action = selectQuotationDetail({ gqPositionId: '1234' });

      expect(action).toEqual({
        gqPositionId: '1234',
        type: '[Process Case] Select a Quotation Detail',
      });
    });

    test('should deselect QuotationDetail', () => {
      action = deselectQuotationDetail({ gqPositionId: '1234' });

      expect(action).toEqual({
        gqPositionId: '1234',
        type: '[Process Case] Deselect a Quotation Detail',
      });
    });
  });
});
