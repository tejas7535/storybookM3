import { VIEW_CASES_MOCK } from '../../../../../testing/mocks';
import { loadCases, loadCasesFailure, loadCasesSuccess } from '../../actions';
import { viewCasesReducer } from './view-cases.reducer';

describe('View Cases Reducer', () => {
  const errorMessage = 'An error occured';
  describe('loadCases', () => {
    test('should set quotationsLoading true', () => {
      const action = loadCases();
      const state = viewCasesReducer(VIEW_CASES_MOCK, action);

      expect(state).toEqual({
        ...VIEW_CASES_MOCK,
        quotationsLoading: true,
      });
    });
  });
  describe('loadCasesFailure', () => {
    test('should set errorMessage and quotationsloading false', () => {
      const action = loadCasesFailure({ errorMessage });
      const state = viewCasesReducer(VIEW_CASES_MOCK, action);

      expect(state).toEqual({
        ...VIEW_CASES_MOCK,
        errorMessage,
        quotationsLoading: false,
      });
    });
  });
  describe('loadCasesSuccess', () => {
    test('should set quotations and set quotationsLoading false', () => {
      const quotations: any[] = [];
      const action = loadCasesSuccess({ quotations });
      const state = viewCasesReducer(VIEW_CASES_MOCK, action);

      expect(state).toEqual({
        ...VIEW_CASES_MOCK,
        quotations,
        quotationsLoading: false,
      });
    });
  });
});
