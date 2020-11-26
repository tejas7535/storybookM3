import {
  loadCases,
  loadCasesFailure,
  loadCasesSuccess,
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
      const quotations = [];
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
  });
});
