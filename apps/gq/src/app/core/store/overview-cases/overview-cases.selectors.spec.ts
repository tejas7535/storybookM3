import { ExtendedViewToggle } from '@gq/case-view/models/extended-view-toggle';
import { translate } from '@ngneat/transloco';

import {
  ACTIVE_STATUS_BAR_CONFIG,
  ARCHIVED_STATUS_BAR_CONFIG,
} from '../../../../app/case-view/case-table/config';
import {
  VIEW_CASE_STATE_MOCK,
  VIEW_QUOTATION_MOCK,
} from '../../../../testing/mocks';
import { QuotationTab } from './models/quotation-tab.enum';
import { initialState, OverviewCasesState } from './overview-cases.reducer';
import * as overviewCasesSelectors from './overview-cases.selectors';

describe('Overview Cases Selector', () => {
  const fakeState = {
    overviewCases: {
      ...initialState,
      quotationsLoading: false,
      quotations: {
        activeTab: QuotationTab.ACTIVE,
        active: {
          quotations: [VIEW_QUOTATION_MOCK],
          count: 1,
        },
        archived: {
          quotations: [] as any,
          count: 0,
        },
      },
      deleteLoading: false,
      selectedCases: [] as number[],
    } as OverviewCasesState,
  };

  describe('getQuotations', () => {
    test('should return active quotations', () => {
      expect(
        overviewCasesSelectors.getQuotations.projector(fakeState.overviewCases)
      ).toEqual(fakeState.overviewCases.quotations.active.quotations);
    });
    test('should return archived quotations', () => {
      const archivedFakeState: OverviewCasesState = {
        ...VIEW_CASE_STATE_MOCK,
        quotations: {
          ...VIEW_CASE_STATE_MOCK.quotations,
          activeTab: QuotationTab.ARCHIVED,
          archived: {
            quotations: [VIEW_QUOTATION_MOCK],
            count: 1,
          },
        },
      };
      expect(
        overviewCasesSelectors.getQuotations.projector(archivedFakeState)
      ).toEqual(archivedFakeState.quotations.archived.quotations);
    });
    test('should return inApproval quotations', () => {
      const inApprovalFakeState: OverviewCasesState = {
        ...VIEW_CASE_STATE_MOCK,
        quotations: {
          ...VIEW_CASE_STATE_MOCK.quotations,
          activeTab: QuotationTab.IN_APPROVAL,
          inApproval: {
            quotations: [VIEW_QUOTATION_MOCK],
            count: 1,
          },
        },
      };
      expect(
        overviewCasesSelectors.getQuotations.projector(inApprovalFakeState)
      ).toEqual(inApprovalFakeState.quotations.inApproval.quotations);
    });

    test('should return toApprove quotations', () => {
      const toApproveFakeState: OverviewCasesState = {
        ...VIEW_CASE_STATE_MOCK,
        quotations: {
          ...VIEW_CASE_STATE_MOCK.quotations,
          activeTab: QuotationTab.TO_APPROVE,
          toApprove: {
            quotations: [VIEW_QUOTATION_MOCK],
            count: 1,
          },
        },
      };
      expect(
        overviewCasesSelectors.getQuotations.projector(toApproveFakeState)
      ).toEqual(toApproveFakeState.quotations.toApprove.quotations);
    });

    test('should return approved quotations', () => {
      const approvedFakeState: OverviewCasesState = {
        ...VIEW_CASE_STATE_MOCK,
        quotations: {
          ...VIEW_CASE_STATE_MOCK.quotations,
          activeTab: QuotationTab.APPROVED,
          approved: {
            quotations: [VIEW_QUOTATION_MOCK],
            count: 1,
          },
        },
      };
      expect(
        overviewCasesSelectors.getQuotations.projector(approvedFakeState)
      ).toEqual(approvedFakeState.quotations.approved.quotations);
    });
  });

  test('should return rejected quotations', () => {
    const rejectedFakeState: OverviewCasesState = {
      ...VIEW_CASE_STATE_MOCK,
      quotations: {
        ...VIEW_CASE_STATE_MOCK.quotations,
        activeTab: QuotationTab.REJECTED,
        rejected: {
          quotations: [VIEW_QUOTATION_MOCK],
          count: 1,
        },
      },
    };
    expect(
      overviewCasesSelectors.getQuotations.projector(rejectedFakeState)
    ).toEqual(rejectedFakeState.quotations.rejected.quotations);
  });

  test('should return undefined', () => {
    const undefinedFakeState: OverviewCasesState = {
      ...VIEW_CASE_STATE_MOCK,
      quotations: {
        ...VIEW_CASE_STATE_MOCK.quotations,
        activeTab: undefined,
      },
    };
    expect(
      overviewCasesSelectors.getQuotations.projector(undefinedFakeState)
    ).toBeUndefined();
  });

  describe('getStatusBarForQuotationStatus', () => {
    test('should return status panel for active quotations', () => {
      expect(
        overviewCasesSelectors.getStatusBarForQuotationStatus.projector(
          fakeState.overviewCases
        )
      ).toEqual(ACTIVE_STATUS_BAR_CONFIG);
    });
    test('should return status panel for archived quotations', () => {
      expect(
        overviewCasesSelectors.getStatusBarForQuotationStatus.projector({
          quotations: {
            activeTab: QuotationTab.ARCHIVED,
          },
        } as OverviewCasesState)
      ).toEqual(ARCHIVED_STATUS_BAR_CONFIG);
    });
  });

  describe('getViewToggles', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    test('should get view toggles', () => {
      const expectedViewToggles: ExtendedViewToggle[] = [
        {
          id: 0,
          tab: QuotationTab.ACTIVE,
          title: 'translate it',
          active: true,
        },
        {
          id: 1,
          tab: QuotationTab.TO_APPROVE,
          active: false,
          title: 'translate it',
          disabled: false,
        },
        {
          id: 2,
          tab: QuotationTab.IN_APPROVAL,
          active: false,
          title: 'translate it',
          disabled: false,
        },
        {
          id: 3,
          tab: QuotationTab.APPROVED,
          active: false,
          title: 'translate it',
          disabled: false,
        },
        {
          id: 4,
          tab: QuotationTab.REJECTED,
          active: false,
          title: 'translate it',
          disabled: false,
        },
        {
          id: 5,
          tab: QuotationTab.ARCHIVED,
          active: false,
          title: 'translate it',
          disabled: false,
        },
      ];
      expect(
        overviewCasesSelectors.getViewToggles.projector(VIEW_CASE_STATE_MOCK)
      ).toEqual(expectedViewToggles);

      expect(translate).toHaveBeenCalledTimes(6);
      expect(translate).toHaveBeenCalledWith(
        'caseView.caseTable.viewToggle.openCases',
        { variable: 1 }
      );
      expect(translate).toHaveBeenCalledWith(
        'caseView.caseTable.viewToggle.deletedDrafts',
        { variable: 2 }
      );
    });
    test('should get view toggles with disabled archived view', () => {
      const expectedViewToggles: ExtendedViewToggle[] = [
        {
          id: 0,
          tab: QuotationTab.ACTIVE,
          active: true,
          title: 'translate it',
        },
        {
          id: 1,
          tab: QuotationTab.TO_APPROVE,
          active: false,
          title: 'translate it',
          disabled: false,
        },
        {
          id: 2,
          tab: QuotationTab.IN_APPROVAL,
          active: false,
          title: 'translate it',
          disabled: false,
        },
        {
          id: 3,
          tab: QuotationTab.APPROVED,
          active: false,
          title: 'translate it',
          disabled: false,
        },
        {
          id: 4,
          tab: QuotationTab.REJECTED,
          active: false,
          title: 'translate it',
          disabled: false,
        },
        {
          id: 5,
          tab: QuotationTab.ARCHIVED,
          active: false,
          title: 'translate it',
          disabled: true,
        },
      ];
      expect(
        overviewCasesSelectors.getViewToggles.projector({
          ...VIEW_CASE_STATE_MOCK,
          quotations: {
            ...VIEW_CASE_STATE_MOCK.quotations,
            archived: {
              count: 0,
              quotations: [],
            },
          },
        })
      ).toEqual(expectedViewToggles);

      expect(translate).toHaveBeenCalledTimes(6);
      expect(translate).toHaveBeenCalledWith(
        'caseView.caseTable.viewToggle.openCases',
        { variable: 1 }
      );
      expect(translate).toHaveBeenCalledWith(
        'caseView.caseTable.viewToggle.deletedDrafts',
        { variable: 0 }
      );
    });
  });

  describe('getQuotationStatusFromView', () => {
    it('should return the displayStatus of viewId', () => {
      const viewToggles: ExtendedViewToggle[] = [
        {
          id: 1,
          tab: QuotationTab.ACTIVE,
        } as unknown as ExtendedViewToggle,
        {
          id: 2,
          tab: QuotationTab.ARCHIVED,
        } as unknown as ExtendedViewToggle,
      ];
      expect(
        overviewCasesSelectors.getQuotationTabFromView(1).projector(viewToggles)
      ).toEqual(QuotationTab.ACTIVE);
    });
  });
  describe('getActiveTab', () => {
    test('should return QuotationStatus.ACTIVE', () => {
      expect(
        overviewCasesSelectors.getActiveTab.projector(
          fakeState.overviewCases.quotations
        )
      ).toBe(QuotationTab.ACTIVE);
    });
  });
});
