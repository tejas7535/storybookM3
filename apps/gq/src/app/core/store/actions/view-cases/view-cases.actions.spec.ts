import { QuotationStatus } from '../../../../shared/models/quotation/quotation-status.enum';
import { GetQuotationsResponse } from '../../../../shared/services/rest/quotation/models/get-quotations-response.interface';
import {
  deselectCase,
  loadCases,
  loadCasesFailure,
  loadCasesSuccess,
  selectCase,
} from './view-cases.actions';

describe('View Actions', () => {
  describe('loadCases Actions', () => {
    test('load Cases', () => {
      const action = loadCases({ status: QuotationStatus.ACTIVE });
      expect(action).toEqual({
        status: QuotationStatus.ACTIVE,
        type: '[View Cases] Get Cases For Authenticated User',
      });
    });
    test('load Cases Success', () => {
      const response: GetQuotationsResponse = {
        activeCount: 0,
        inactiveCount: 0,
        quotations: [],
        statusTypeOfListedQuotation: QuotationStatus[QuotationStatus.ACTIVE],
      };
      const action = loadCasesSuccess({ response });
      expect(action).toEqual({
        response,
        type: '[View Cases] Get Cases for Authenticated User Success',
      });
    });
    test('load Cases Failure', () => {
      const errorMessage = 'error message';
      const action = loadCasesFailure({ errorMessage });
      expect(action).toEqual({
        errorMessage,
        type: '[View Cases] Get Cases for Authenticated User Failure',
      });
    });
    test('select Case', () => {
      const action = selectCase({ gqId: 1234 });
      expect(action).toEqual({
        gqId: 1234,
        type: '[View Cases] Select a Case',
      });
    });

    test('deselect case', () => {
      const action = deselectCase({ gqId: 1234 });
      expect(action).toEqual({
        gqId: 1234,
        type: '[View Cases] Deselect a Case',
      });
    });
  });
});
