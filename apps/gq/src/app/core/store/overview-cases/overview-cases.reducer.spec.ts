import { QuotationStatus } from '@gq/shared/models/quotation/quotation-status.enum';

import {
  GET_QUOTATIONS_RESPONSE_MOCK,
  VIEW_CASE_STATE_MOCK,
  VIEW_QUOTATION_MOCK,
} from '../../../../testing/mocks';
import { GET_QUOTATIONS_COUNT_MOCK } from '../../../../testing/mocks/models/get-quotations-count.mock';
import { QuotationTab } from './models/quotation-tab.enum';
import { OverviewCasesActions } from './overview-cases.actions';
import { overviewCasesFeature } from './overview-cases.reducer';

describe('Overview Cases Reducer', () => {
  const errorMessage = 'An error occurred';
  describe('loadCases', () => {
    test('should set quotationsLoading true', () => {
      const action = OverviewCasesActions.loadCases({
        tab: QuotationTab.ARCHIVED,
      });
      const state = overviewCasesFeature.reducer(VIEW_CASE_STATE_MOCK, action);

      expect(state).toEqual({
        ...VIEW_CASE_STATE_MOCK,
        quotationsLoading: true,
        quotations: {
          ...VIEW_CASE_STATE_MOCK.quotations,
          activeTab: QuotationStatus.ARCHIVED,
        },
      });
    });
  });
  describe('loadCasesFailure', () => {
    test('should set errorMessage and quotationsLoading false', () => {
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
    // amount of quotations are not updated when receiving the loadCasesSuccess, so will be 0
    test('should set active quotations and set quotationsLoading false', () => {
      const action = OverviewCasesActions.loadCasesSuccess({
        response: {
          ...GET_QUOTATIONS_RESPONSE_MOCK,
          quotations: [VIEW_QUOTATION_MOCK],
        },
      });
      const state = overviewCasesFeature.reducer(VIEW_CASE_STATE_MOCK, action);

      expect(state).toEqual({
        ...VIEW_CASE_STATE_MOCK,
        quotations: {
          ...VIEW_CASE_STATE_MOCK.quotations,
          activeTab: QuotationTab.ACTIVE,
          active: {
            ...VIEW_CASE_STATE_MOCK.quotations.active,
            quotations: [VIEW_QUOTATION_MOCK],
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
        },
      });
      const state = overviewCasesFeature.reducer(
        {
          ...VIEW_CASE_STATE_MOCK,
          quotations: {
            ...VIEW_CASE_STATE_MOCK.quotations,
            activeTab: QuotationTab.ARCHIVED,
          },
        },
        action
      );

      expect(state).toEqual({
        ...VIEW_CASE_STATE_MOCK,
        quotations: {
          ...VIEW_CASE_STATE_MOCK.quotations,
          activeTab: QuotationTab.ARCHIVED,
          archived: {
            ...VIEW_CASE_STATE_MOCK.quotations.archived,
            quotations: [VIEW_QUOTATION_MOCK],
          },
        },
        quotationsLoading: false,
      });
    });
    test('should set toApprove quotations and set quotationsLoading false', () => {
      const action = OverviewCasesActions.loadCasesSuccess({
        response: {
          ...GET_QUOTATIONS_RESPONSE_MOCK,
          quotations: [VIEW_QUOTATION_MOCK],
        },
      });
      const state = overviewCasesFeature.reducer(
        {
          ...VIEW_CASE_STATE_MOCK,
          quotations: {
            ...VIEW_CASE_STATE_MOCK.quotations,
            activeTab: QuotationTab.TO_APPROVE,
          },
        },
        action
      );

      expect(state).toEqual({
        ...VIEW_CASE_STATE_MOCK,
        quotations: {
          ...VIEW_CASE_STATE_MOCK.quotations,
          activeTab: QuotationTab.TO_APPROVE,
          toApprove: {
            ...VIEW_CASE_STATE_MOCK.quotations.toApprove,
            quotations: [VIEW_QUOTATION_MOCK],
          },
        },
        quotationsLoading: false,
      });
    });

    test('should set inApproval quotations and set quotationsLoading false', () => {
      const action = OverviewCasesActions.loadCasesSuccess({
        response: {
          ...GET_QUOTATIONS_RESPONSE_MOCK,
          quotations: [VIEW_QUOTATION_MOCK],
        },
      });
      const state = overviewCasesFeature.reducer(
        {
          ...VIEW_CASE_STATE_MOCK,
          quotations: {
            ...VIEW_CASE_STATE_MOCK.quotations,
            activeTab: QuotationTab.IN_APPROVAL,
          },
        },
        action
      );

      expect(state).toEqual({
        ...VIEW_CASE_STATE_MOCK,
        quotations: {
          ...VIEW_CASE_STATE_MOCK.quotations,
          activeTab: QuotationTab.IN_APPROVAL,
          inApproval: {
            ...VIEW_CASE_STATE_MOCK.quotations.inApproval,
            quotations: [VIEW_QUOTATION_MOCK],
          },
        },
        quotationsLoading: false,
      });
    });

    test('should set approved quotations and set quotationsLoading false', () => {
      const action = OverviewCasesActions.loadCasesSuccess({
        response: {
          ...GET_QUOTATIONS_RESPONSE_MOCK,
          quotations: [VIEW_QUOTATION_MOCK],
        },
      });
      const state = overviewCasesFeature.reducer(
        {
          ...VIEW_CASE_STATE_MOCK,
          quotations: {
            ...VIEW_CASE_STATE_MOCK.quotations,
            activeTab: QuotationTab.APPROVED,
          },
        },
        action
      );

      expect(state).toEqual({
        ...VIEW_CASE_STATE_MOCK,
        quotations: {
          ...VIEW_CASE_STATE_MOCK.quotations,
          activeTab: QuotationTab.APPROVED,
          approved: {
            ...VIEW_CASE_STATE_MOCK.quotations.approved,
            quotations: [VIEW_QUOTATION_MOCK],
          },
        },
        quotationsLoading: false,
      });
    });

    test('should set rejected quotations and set quotationsLoading false', () => {
      const action = OverviewCasesActions.loadCasesSuccess({
        response: {
          ...GET_QUOTATIONS_RESPONSE_MOCK,
          quotations: [VIEW_QUOTATION_MOCK],
        },
      });
      const state = overviewCasesFeature.reducer(
        {
          ...VIEW_CASE_STATE_MOCK,
          quotations: {
            ...VIEW_CASE_STATE_MOCK.quotations,
            activeTab: QuotationTab.REJECTED,
          },
        },
        action
      );

      expect(state).toEqual({
        ...VIEW_CASE_STATE_MOCK,
        quotations: {
          ...VIEW_CASE_STATE_MOCK.quotations,
          activeTab: QuotationTab.REJECTED,
          rejected: {
            ...VIEW_CASE_STATE_MOCK.quotations.rejected,
            quotations: [VIEW_QUOTATION_MOCK],
          },
        },
        quotationsLoading: false,
      });
    });

    test('should set shared quotations and set quotationsLoading false', () => {
      const action = OverviewCasesActions.loadCasesSuccess({
        response: {
          ...GET_QUOTATIONS_RESPONSE_MOCK,
          quotations: [VIEW_QUOTATION_MOCK],
        },
      });
      const state = overviewCasesFeature.reducer(
        {
          ...VIEW_CASE_STATE_MOCK,
          quotations: {
            ...VIEW_CASE_STATE_MOCK.quotations,
            activeTab: QuotationTab.SHARED,
          },
        },
        action
      );

      expect(state).toEqual({
        ...VIEW_CASE_STATE_MOCK,
        quotations: {
          ...VIEW_CASE_STATE_MOCK.quotations,
          activeTab: QuotationTab.SHARED,
          shared: {
            ...VIEW_CASE_STATE_MOCK.quotations.shared,
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
  describe('getCasesCount', () => {
    test('should set quotationsCountLoading true', () => {
      const action = OverviewCasesActions.getCasesCount();
      const state = overviewCasesFeature.reducer(VIEW_CASE_STATE_MOCK, action);

      expect(state).toEqual({
        ...VIEW_CASE_STATE_MOCK,
        quotationsCountLoading: true,
      });
    });
  });
  describe('getCasesCountFailure', () => {
    test('should set errorMessage and quotationsCountLoading false', () => {
      const action = OverviewCasesActions.getCasesCountFailure({
        errorMessage,
      });
      const state = overviewCasesFeature.reducer(VIEW_CASE_STATE_MOCK, action);

      expect(state).toEqual({
        ...VIEW_CASE_STATE_MOCK,
        errorMessage,
        quotationsCountLoading: false,
      });
    });
  });

  describe('getCasesCountSuccess', () => {
    test('should set quotationsCountLoading false', () => {
      const action = OverviewCasesActions.getCasesCountSuccess({
        response: GET_QUOTATIONS_COUNT_MOCK,
      });
      const state = overviewCasesFeature.reducer(VIEW_CASE_STATE_MOCK, action);

      expect(state).toEqual({
        ...VIEW_CASE_STATE_MOCK,
        quotationsCountLoading: false,
        quotations: {
          ...VIEW_CASE_STATE_MOCK.quotations,
          active: {
            ...VIEW_CASE_STATE_MOCK.quotations.active,
            count: GET_QUOTATIONS_COUNT_MOCK.activeCount,
          },
          archived: {
            ...VIEW_CASE_STATE_MOCK.quotations.archived,
            count: GET_QUOTATIONS_COUNT_MOCK.archivedCount,
          },
          toApprove: {
            ...VIEW_CASE_STATE_MOCK.quotations.toApprove,
            count: GET_QUOTATIONS_COUNT_MOCK.toApproveCount,
          },
          inApproval: {
            ...VIEW_CASE_STATE_MOCK.quotations.inApproval,
            count: GET_QUOTATIONS_COUNT_MOCK.inApprovalCount,
          },
          approved: {
            ...VIEW_CASE_STATE_MOCK.quotations.approved,
            count: GET_QUOTATIONS_COUNT_MOCK.approvedCount,
          },
          rejected: {
            ...VIEW_CASE_STATE_MOCK.quotations.rejected,
            count: GET_QUOTATIONS_COUNT_MOCK.rejectedCount,
          },
          shared: {
            ...VIEW_CASE_STATE_MOCK.quotations.shared,
            count: GET_QUOTATIONS_COUNT_MOCK.sharedCount,
          },
        },
      });
    });
  });
});
