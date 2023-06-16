import { ExtendedViewToggle } from '@gq/case-view/models/extended-view-toggle';
import { QuotationStatus } from '@gq/shared/models';
import { translate } from '@ngneat/transloco';

import {
  ACTIVE_STATUS_BAR_CONFIG,
  ARCHIVED_STATUS_BAR_CONFIG,
} from '../../../../app/case-view/case-table/config';
import {
  VIEW_CASE_STATE_MOCK,
  VIEW_QUOTATION_MOCK,
} from '../../../../testing/mocks';
import { initialState, OverviewCasesState } from './overview-cases.reducer';
import * as overviewCasesSelectors from './overview-cases.selectors';

describe('Overview Cases Selector', () => {
  const fakeState = {
    overviewCases: {
      ...initialState,
      quotationsLoading: false,
      quotations: {
        displayStatus: QuotationStatus.ACTIVE,
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
          displayStatus: QuotationStatus.ARCHIVED,
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
            displayStatus: QuotationStatus.ARCHIVED,
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
          status: QuotationStatus.ACTIVE,
          title: 'translate it',
          active: true,
        },

        {
          id: 3,
          status: QuotationStatus.TO_BE_APPROVED,
          active: false,
          title: 'translate it',
          disabled: false,
        },
        {
          id: 4,
          status: QuotationStatus.IN_APPROVAL,
          active: false,
          title: 'translate it',
          disabled: false,
        },
        {
          id: 5,
          status: QuotationStatus.APPROVED,
          active: false,
          title: 'translate it',
          disabled: false,
        },
        {
          id: 1,
          status: QuotationStatus.ARCHIVED,
          active: false,
          title: 'translate it',
          disabled: false,
        },
      ];
      expect(
        overviewCasesSelectors.getViewToggles.projector(VIEW_CASE_STATE_MOCK)
      ).toEqual(expectedViewToggles);

      expect(translate).toHaveBeenCalledTimes(5);
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
          status: QuotationStatus.ACTIVE,
          active: true,
          title: 'translate it',
        },
        {
          id: 3,
          status: QuotationStatus.TO_BE_APPROVED,
          active: false,
          title: 'translate it',
          disabled: false,
        },
        {
          id: 4,
          status: QuotationStatus.IN_APPROVAL,
          active: false,
          title: 'translate it',
          disabled: false,
        },
        {
          id: 5,
          status: QuotationStatus.APPROVED,
          active: false,
          title: 'translate it',
          disabled: false,
        },
        {
          id: 1,
          status: QuotationStatus.ARCHIVED,
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

      expect(translate).toHaveBeenCalledTimes(5);
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
          status: QuotationStatus.ACTIVE,
        } as unknown as ExtendedViewToggle,
        {
          id: 2,
          status: QuotationStatus.DELETED,
        } as unknown as ExtendedViewToggle,
      ];
      expect(
        overviewCasesSelectors
          .getQuotationStatusFromView(1)
          .projector(viewToggles)
      ).toEqual(QuotationStatus.ACTIVE);
    });
  });
  describe('getDisplayStatus', () => {
    test('should return QuotationStatus.ACTIVE', () => {
      expect(
        overviewCasesSelectors.getDisplayStatus.projector(
          fakeState.overviewCases.quotations
        )
      ).toBe(QuotationStatus.ACTIVE);
    });
  });
});
