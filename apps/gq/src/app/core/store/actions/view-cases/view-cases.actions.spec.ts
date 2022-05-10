import { ViewQuotation } from '../../../../case-view/models/view-quotation.model';
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
      const action = loadCases();
      expect(action).toEqual({
        type: '[View Cases] Get Cases For Authenticated User',
      });
    });
    test('load Cases Success', () => {
      const quotations: ViewQuotation[] = [];
      const action = loadCasesSuccess({ quotations });
      expect(action).toEqual({
        quotations,
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
