import { QuotationStatus } from '@gq/shared/models/quotation/quotation-status.enum';

import {
  GET_QUOTATIONS_RESPONSE_MOCK,
  VIEW_CASE_STATE_MOCK,
  VIEW_QUOTATION_MOCK,
} from '../../../../testing/mocks';
import { OverviewCasesActions } from './overview-cases.actions';
import { overviewCasesFeature } from './overview-cases.reducer';

describe('Overview Cases Reducer', () => {
  const errorMessage = 'An error occured';
  describe('loadCases', () => {
    test('should set quotationsLoading true', () => {
      const action = OverviewCasesActions.loadCases({
        status: QuotationStatus.ARCHIVED,
      });
      const state = overviewCasesFeature.reducer(VIEW_CASE_STATE_MOCK, action);

      expect(state).toEqual({
        ...VIEW_CASE_STATE_MOCK,
        quotationsLoading: true,
        quotations: {
          ...VIEW_CASE_STATE_MOCK.quotations,
          displayStatus: QuotationStatus.ARCHIVED,
        },
      });
    });
  });
  describe('loadCasesFailure', () => {
    test('should set errorMessage and quotationsloading false', () => {
      const action = OverviewCasesActions.loadCasesFailure({ errorMessage });
      const state = overviewCasesFeature.reducer(VIEW_CASE_STATE_MOCK, action);

      expect(state).toEqual({
        ...VIEW_CASE_STATE_MOCK,
        errorMessage,
        quotationsLoading: false,
      });
    });
  });
  describe('loadCasesSuccess', () => {
    test('should set active quotations and set quotationsLoading false', () => {
      const action = OverviewCasesActions.loadCasesSuccess({
        response: {
          ...GET_QUOTATIONS_RESPONSE_MOCK,
          activeCount: 1,
          quotations: [VIEW_QUOTATION_MOCK],
          statusTypeOfListedQuotation: QuotationStatus.ACTIVE,
        },
      });
      const state = overviewCasesFeature.reducer(VIEW_CASE_STATE_MOCK, action);

      expect(state).toEqual({
        ...VIEW_CASE_STATE_MOCK,
        quotations: {
          ...VIEW_CASE_STATE_MOCK.quotations,
          archived: {
            count: GET_QUOTATIONS_RESPONSE_MOCK.archivedCount,
            quotations: [],
          },
          active: {
            count: 1,
            quotations: [VIEW_QUOTATION_MOCK],
          },
          inApproval: {
            count: GET_QUOTATIONS_RESPONSE_MOCK.inApprovalCount,
            quotations: [],
          },
          approved: {
            count: GET_QUOTATIONS_RESPONSE_MOCK.approvedCount,
            quotations: [],
          },
        },
        quotationsLoading: false,
      });
    });
    test('should set archived quotations and set quotationsLoading false', () => {
      const action = OverviewCasesActions.loadCasesSuccess({
        response: {
          ...GET_QUOTATIONS_RESPONSE_MOCK,
          quotations: [VIEW_QUOTATION_MOCK],
          archivedCount: 1,
          statusTypeOfListedQuotation: QuotationStatus.ARCHIVED,
        },
      });
      const state = overviewCasesFeature.reducer(VIEW_CASE_STATE_MOCK, action);

      expect(state).toEqual({
        ...VIEW_CASE_STATE_MOCK,
        quotations: {
          ...VIEW_CASE_STATE_MOCK.quotations,
          archived: {
            count: 1,
            quotations: [VIEW_QUOTATION_MOCK],
          },
          active: {
            count: GET_QUOTATIONS_RESPONSE_MOCK.activeCount,
            quotations: [],
          },
          inApproval: {
            count: GET_QUOTATIONS_RESPONSE_MOCK.inApprovalCount,
            quotations: [],
          },
          approved: {
            count: GET_QUOTATIONS_RESPONSE_MOCK.approvedCount,
            quotations: [],
          },
        },
        quotationsLoading: false,
      });
    });
    test('should set inApproval quotations and set quotationsLoading false', () => {
      const action = OverviewCasesActions.loadCasesSuccess({
        response: {
          ...GET_QUOTATIONS_RESPONSE_MOCK,
          inApprovalCount: 1,
          quotations: [VIEW_QUOTATION_MOCK],
          statusTypeOfListedQuotation: QuotationStatus.IN_APPROVAL,
        },
      });
      const state = overviewCasesFeature.reducer(VIEW_CASE_STATE_MOCK, action);

      expect(state).toEqual({
        ...VIEW_CASE_STATE_MOCK,
        quotations: {
          ...VIEW_CASE_STATE_MOCK.quotations,
          active: {
            count: GET_QUOTATIONS_RESPONSE_MOCK.activeCount,
            quotations: [],
          },
          archived: {
            count: GET_QUOTATIONS_RESPONSE_MOCK.archivedCount,
            quotations: [],
          },
          inApproval: {
            count: 1,
            quotations: [VIEW_QUOTATION_MOCK],
          },
          approved: {
            count: GET_QUOTATIONS_RESPONSE_MOCK.approvedCount,
            quotations: [],
          },
        },
        quotationsLoading: false,
      });
    });

    test('should set approved quotations and set quotationsLoading false', () => {
      const action = OverviewCasesActions.loadCasesSuccess({
        response: {
          ...GET_QUOTATIONS_RESPONSE_MOCK,
          approvedCount: 1,
          quotations: [VIEW_QUOTATION_MOCK],
          statusTypeOfListedQuotation: QuotationStatus.APPROVED,
        },
      });
      const state = overviewCasesFeature.reducer(VIEW_CASE_STATE_MOCK, action);

      expect(state).toEqual({
        ...VIEW_CASE_STATE_MOCK,
        quotations: {
          ...VIEW_CASE_STATE_MOCK.quotations,
          active: {
            count: GET_QUOTATIONS_RESPONSE_MOCK.activeCount,
            quotations: [],
          },
          archived: {
            count: GET_QUOTATIONS_RESPONSE_MOCK.archivedCount,
            quotations: [],
          },
          inApproval: {
            count: GET_QUOTATIONS_RESPONSE_MOCK.inApprovalCount,
            quotations: [],
          },
          approved: {
            count: 1,
            quotations: [VIEW_QUOTATION_MOCK],
          },
        },
        quotationsLoading: false,
      });
    });
  });
  describe('updateCaseStatus', () => {
    test('should set deleteloading true', () => {
      const gqIds = [1];
      const status = QuotationStatus.ARCHIVED;
      const action = OverviewCasesActions.updateCasesStatus({ gqIds, status });

      const state = overviewCasesFeature.reducer(
        { ...VIEW_CASE_STATE_MOCK, selectedCases: [1234, 5678] },
        action
      );

      expect(state).toEqual({
        ...VIEW_CASE_STATE_MOCK,
        deleteLoading: true,
        selectedCases: [1234, 5678],
      });
    });
  });
  describe('updateCaseStatusSuccess', () => {
    test('should set deleteloading false and quotationLoading true', () => {
      const action = OverviewCasesActions.updateCasesStatusSuccess({
        gqIds: [1234, 5678],
      });
      const state = overviewCasesFeature.reducer(
        { ...VIEW_CASE_STATE_MOCK, selectedCases: [1234, 5678] },
        action
      );
      expect(state).toEqual({
        ...VIEW_CASE_STATE_MOCK,
        deleteLoading: false,
        quotationsLoading: false,
        selectedCases: [],
      });
    });
  });
  describe('updateCaseStatusFailure', () => {
    test('should set errorMessage and deleteLoading false', () => {
      const action = OverviewCasesActions.updateCasesStatusFailure({
        errorMessage,
      });
      const state = overviewCasesFeature.reducer(
        { ...VIEW_CASE_STATE_MOCK, selectedCases: [1234, 5678] },
        action
      );

      expect(state).toEqual({
        ...VIEW_CASE_STATE_MOCK,
        errorMessage,
        deleteLoading: false,
        selectedCases: [1234, 5678],
      });
    });
  });

  describe('case selection', () => {
    test('should select a case', () => {
      const action = OverviewCasesActions.selectCase({ gqId: 1234 });
      const state = overviewCasesFeature.reducer(VIEW_CASE_STATE_MOCK, action);

      expect(state).toEqual({
        ...VIEW_CASE_STATE_MOCK,
        selectedCases: [1234],
      });
    });

    test('should deselect a case', () => {
      const action = OverviewCasesActions.deselectCase({ gqId: 1234 });
      const state = overviewCasesFeature.reducer(
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
