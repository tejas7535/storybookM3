import { Action } from '@ngrx/store';

import {
  GET_QUOTATIONS_RESPONSE_MOCK,
  VIEW_CASE_STATE_MOCK,
  VIEW_QUOTATION_MOCK,
} from '../../../../../testing/mocks';
import { QuotationStatus } from '../../../../shared/models/quotation/quotation-status.enum';
import {
  deleteCase,
  deleteCasesFailure,
  deleteCasesSuccess,
  deselectCase,
  loadCases,
  loadCasesFailure,
  loadCasesSuccess,
  selectCase,
} from '../../actions';
import { reducer, viewCasesReducer } from './view-cases.reducer';

describe('View Cases Reducer', () => {
  const errorMessage = 'An error occured';
  describe('loadCases', () => {
    test('should set quotationsLoading true', () => {
      const action = loadCases({ status: QuotationStatus.INACTIVE });
      const state = viewCasesReducer(VIEW_CASE_STATE_MOCK, action);

      expect(state).toEqual({
        ...VIEW_CASE_STATE_MOCK,
        quotationsLoading: true,
        quotations: {
          ...VIEW_CASE_STATE_MOCK.quotations,
          displayStatus: QuotationStatus.INACTIVE,
        },
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
    test('should set active quotations and set quotationsLoading false', () => {
      const action = loadCasesSuccess({
        response: {
          ...GET_QUOTATIONS_RESPONSE_MOCK,
          quotations: [VIEW_QUOTATION_MOCK],
        },
      });
      const state = viewCasesReducer(VIEW_CASE_STATE_MOCK, action);

      expect(state).toEqual({
        ...VIEW_CASE_STATE_MOCK,
        quotations: {
          ...VIEW_CASE_STATE_MOCK.quotations,
          inactive: {
            count: GET_QUOTATIONS_RESPONSE_MOCK.inactiveCount,
            quotations: [],
          },
          active: {
            count: GET_QUOTATIONS_RESPONSE_MOCK.activeCount,
            quotations: [VIEW_QUOTATION_MOCK],
          },
        },
        quotationsLoading: false,
      });
    });
    test('should set inactive quotations and set quotationsLoading false', () => {
      const action = loadCasesSuccess({
        response: {
          ...GET_QUOTATIONS_RESPONSE_MOCK,
          quotations: [VIEW_QUOTATION_MOCK],
          statusTypeOfListedQuotation:
            QuotationStatus[QuotationStatus.INACTIVE],
        },
      });
      const state = viewCasesReducer(VIEW_CASE_STATE_MOCK, action);

      expect(state).toEqual({
        ...VIEW_CASE_STATE_MOCK,
        quotations: {
          ...VIEW_CASE_STATE_MOCK.quotations,
          inactive: {
            count: GET_QUOTATIONS_RESPONSE_MOCK.inactiveCount,
            quotations: [VIEW_QUOTATION_MOCK],
          },
          active: {
            count: GET_QUOTATIONS_RESPONSE_MOCK.activeCount,
            quotations: [],
          },
        },
        quotationsLoading: false,
      });
    });
  });
  describe('deleteCase', () => {
    test('should set deleteloading true', () => {
      const gqIds = [1];
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
      const action: Action = loadCases({ status: QuotationStatus.ACTIVE });
      expect(reducer(VIEW_CASE_STATE_MOCK, action)).toEqual(
        viewCasesReducer(VIEW_CASE_STATE_MOCK, action)
      );
    });
  });
  describe('case selection', () => {
    test('should select a case', () => {
      const action = selectCase({ gqId: 1234 });
      const state = viewCasesReducer(VIEW_CASE_STATE_MOCK, action);

      expect(state).toEqual({
        ...VIEW_CASE_STATE_MOCK,
        selectedCases: [1234],
      });
    });

    test('should deselect a case', () => {
      const action = deselectCase({ gqId: 1234 });
      const state = viewCasesReducer(
        { ...VIEW_CASE_STATE_MOCK, selectedCases: [1234, 5678] },
        action
      );

      expect(state).toEqual({
        ...VIEW_CASE_STATE_MOCK,
        selectedCases: [5678],
      });
    });
  });
});
