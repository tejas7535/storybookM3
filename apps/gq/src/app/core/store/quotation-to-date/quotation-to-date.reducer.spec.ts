import { QuotationToDateActions } from '@gq/core/store/quotation-to-date/quotation-to-date.actions';
import { QuotationToDate } from '@gq/core/store/quotation-to-date/quotation-to-date.model';
import {
  initialState,
  quotationToDateFeature,
} from '@gq/core/store/quotation-to-date/quotation-to-date.reducer';

describe('quotationToDateReducer', () => {
  describe('getQuotationToDate', () => {
    test('should set quotationToDateLoading to true', () => {
      const customerId = { customerId: '2014', salesOrg: '2015' };
      const action = QuotationToDateActions.getQuotationToDate({ customerId });
      const state = quotationToDateFeature.reducer(initialState, action);
      expect(state.quotationToDateLoading).toBe(true);
    });
    test('should set quotationToDateLoading to false and set quotationToDate', () => {
      const quotationToDate: QuotationToDate = {
        extendedDate: '2024-12-31',
        extendedDateForManyItems: '2025-01-01',
        manyItemsDateThreshold: 20,
      };
      const action = QuotationToDateActions.getQuotationToDateSuccess({
        quotationToDate,
      });
      const state = quotationToDateFeature.reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        quotationToDate,
        quotationToDateLoading: false,
        errorMessage: undefined,
      });
    });
    test('should set quotationToDateLoading to false and set errorMessage', () => {
      const errorMessage = 'error';
      const action = QuotationToDateActions.getQuotationToDateFailure({
        errorMessage,
      });
      const state = quotationToDateFeature.reducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        quotationToDate: null,
        quotationToDateLoading: false,
        errorMessage,
      });
    });
  });
});
