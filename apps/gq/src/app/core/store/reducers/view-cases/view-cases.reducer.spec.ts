import { Action } from '@ngrx/store';

import { VIEW_CASE_STATE_MOCK } from '../../../../../testing/mocks';
import {
  deleteCase,
  deleteCasesFailure,
  deleteCasesSuccess,
  loadCases,
  loadCasesFailure,
  loadCasesSuccess,
} from '../../actions';
import { reducer, viewCasesReducer } from './view-cases.reducer';

describe('View Cases Reducer', () => {
  const errorMessage = 'An error occured';
  describe('loadCases', () => {
    test('should set quotationsLoading true', () => {
      const action = loadCases();
      const state = viewCasesReducer(VIEW_CASE_STATE_MOCK, action);

      expect(state).toEqual({
        ...VIEW_CASE_STATE_MOCK,
        quotationsLoading: true,
      });
    });
  });
  describe('loadCasesFailure', () => {
    test('should set errorMessage and quotationsloading false', () => {
      const action = loadCasesFailure({ errorMessage });
      const state = viewCasesReducer(VIEW_CASE_STATE_MOCK, action);

      expect(state).toEqual({
        ...VIEW_CASE_STATE_MOCK,
        errorMessage,
        quotationsLoading: false,
      });
    });
  });
  describe('loadCasesSuccess', () => {
    test('should set quotations and set quotationsLoading false', () => {
      const quotations: any[] = [];
      const action = loadCasesSuccess({ quotations });
      const state = viewCasesReducer(VIEW_CASE_STATE_MOCK, action);

      expect(state).toEqual({
        ...VIEW_CASE_STATE_MOCK,
        quotations,
        quotationsLoading: false,
      });
    });
  });
  describe('deleteCase', () => {
    test('should set deleteloading true', () => {
      const gqIds = ['1'];
      const action = deleteCase({ gqIds });
      const state = viewCasesReducer(VIEW_CASE_STATE_MOCK, action);

      expect(state).toEqual({
        ...VIEW_CASE_STATE_MOCK,
        deleteLoading: true,
      });
    });
  });
  describe('deleteCaseSuccess', () => {
    test('should set deleteloading false and quotationLoading true', () => {
      const action = deleteCasesSuccess();
      const state = viewCasesReducer(VIEW_CASE_STATE_MOCK, action);

      expect(state).toEqual({
        ...VIEW_CASE_STATE_MOCK,
        deleteLoading: false,
        quotationsLoading: true,
      });
    });
  });
  describe('deleteCaseFailure', () => {
    test('should set errorMessage and deleteLoading false', () => {
      const action = deleteCasesFailure({ errorMessage });
      const state = viewCasesReducer(VIEW_CASE_STATE_MOCK, action);

      expect(state).toEqual({
        ...VIEW_CASE_STATE_MOCK,
        errorMessage,
        deleteLoading: false,
      });
    });
  });
  describe('Reducer function', () => {
    test('should return searchReducer', () => {
      // prepare any action
      const action: Action = loadCases();
      expect(reducer(VIEW_CASE_STATE_MOCK, action)).toEqual(
        viewCasesReducer(VIEW_CASE_STATE_MOCK, action)
      );
    });
  });
});
