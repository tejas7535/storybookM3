import {
  loadSapPriceDetails,
  loadSapPriceDetailsFailure,
  loadSapPriceDetailsSuccess,
  SapPriceDetailsActions,
} from './sap-price-details.actions';

describe('SapPriceDetailActions', () => {
  let action: SapPriceDetailsActions;
  let errorMessage: string;

  beforeEach(() => {
    action = undefined;
    errorMessage = 'An error occured';
  });

  describe('loadSapPriceDetails', () => {
    test('loadSapPriceDetails', () => {
      const gqPositionId = '123';
      action = loadSapPriceDetails({ gqPositionId });
      expect(action).toEqual({
        gqPositionId,
        type: '[SAP Price Details] Load SAP Price Details for QuotationDetail',
      });
    });
  });
  describe('loadSapPriceDetailsSuccess', () => {
    test('loadSapPriceDetailsSuccess', () => {
      const sapPriceDetails: any[] = [];
      action = loadSapPriceDetailsSuccess({ sapPriceDetails });
      expect(action).toEqual({
        sapPriceDetails,
        type: '[SAP Price Details] Load SAP Price Details for QuotationDetail Success',
      });
    });
  });
  describe('loadSapPriceDetailsFailure', () => {
    test('loadSapPriceDetailsFailure', () => {
      action = loadSapPriceDetailsFailure({ errorMessage });
      expect(action).toEqual({
        errorMessage,
        type: '[SAP Price Details] Load SAP Price Details for QuotationDetail Failure',
      });
    });
  });
});
