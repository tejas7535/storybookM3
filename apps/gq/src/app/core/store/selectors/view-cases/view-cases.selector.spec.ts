import { ExtendedViewToggle } from '@gq/case-view/models/extended-view-toggle';
import { translate } from '@ngneat/transloco';

import {
  ACTIVE_STATUS_BAR_CONFIG,
  ARCHIVED_STATUS_BAR_CONFIG,
} from '../../../../../app/case-view/case-table/config';
import {
  VIEW_CASE_STATE_MOCK,
  VIEW_QUOTATION_MOCK,
} from '../../../../../testing/mocks';
import { QuotationStatus } from '../../../../shared/models';
import {
  initialState,
  ViewCasesState,
} from '../../reducers/view-cases/view-cases.reducer';
import * as viewCasesSelectors from './view-cases.selector';

describe('View Cases Selector', () => {
  const fakeState = {
    viewCases: {
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
    },
  };

  describe('getQuotations', () => {
    test('should return active quotations', () => {
      expect(
        viewCasesSelectors.getQuotations.projector(fakeState.viewCases)
      ).toEqual(fakeState.viewCases.quotations.active.quotations);
    });
    test('should return archived quotations', () => {
      const archivedFakeState: ViewCasesState = {
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
        viewCasesSelectors.getQuotations.projector(archivedFakeState)
      ).toEqual(archivedFakeState.quotations.archived.quotations);
    });
  });

  describe('getStatusBarForQuotationStatus', () => {
    test('should return status panel for active quotations', () => {
      expect(
        viewCasesSelectors.getStatusBarForQuotationStatus.projector(
          fakeState.viewCases
        )
      ).toEqual(ACTIVE_STATUS_BAR_CONFIG);
    });
    test('should return status panel for archived quotations', () => {
      expect(
        viewCasesSelectors.getStatusBarForQuotationStatus.projector({
          quotations: { displayStatus: QuotationStatus.ARCHIVED },
        })
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
        viewCasesSelectors.getViewToggles.projector(VIEW_CASE_STATE_MOCK)
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
        viewCasesSelectors.getViewToggles.projector({
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

  describe('getDisplayStatus', () => {
    test('should return QuotationStatus.ACTIVE', () => {
      expect(
        viewCasesSelectors.getDisplayStatus.projector(fakeState.viewCases)
      ).toBe(QuotationStatus.ACTIVE);
    });
  });

  describe('getQuotationsLoading', () => {
    test('should return false', () => {
      expect(
        viewCasesSelectors.getQuotationsLoading.projector(fakeState)
      ).toBeFalsy();
    });
  });

  describe('getDeleteLoading', () => {
    test('should return false', () => {
      expect(
        viewCasesSelectors.getDeleteLoading.projector(fakeState)
      ).toBeFalsy();
    });
  });
  describe('getSelectedCaseIds', () => {
    test('should return selected cases', () => {
      expect(
        viewCasesSelectors.getSelectedCaseIds.projector(fakeState.viewCases)
      ).toEqual(fakeState.viewCases.selectedCases);
    });
  });
});
