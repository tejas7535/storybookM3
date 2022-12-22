import { translate } from '@ngneat/transloco';

import { ViewToggle } from '@schaeffler/view-toggle';

import {
  ACTIVE_STATUS_BAR_CONFIG,
  INACTIVE_STATUS_BAR_CONFIG,
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
        inactive: {
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
    test('should return inactive quotations', () => {
      const inactiveFakeState: ViewCasesState = {
        ...VIEW_CASE_STATE_MOCK,
        quotations: {
          ...VIEW_CASE_STATE_MOCK.quotations,
          displayStatus: QuotationStatus.INACTIVE,
          inactive: {
            quotations: [VIEW_QUOTATION_MOCK],
            count: 1,
          },
        },
      };
      expect(
        viewCasesSelectors.getQuotations.projector(inactiveFakeState)
      ).toEqual(inactiveFakeState.quotations.inactive.quotations);
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
    test('should return status panel for inactive quotations', () => {
      expect(
        viewCasesSelectors.getStatusBarForQuotationStatus.projector({
          quotations: { displayStatus: QuotationStatus.INACTIVE },
        })
      ).toEqual(INACTIVE_STATUS_BAR_CONFIG);
    });
  });

  describe('getViewToggles', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    test('should get view toggles', () => {
      const expectedViewToggles: ViewToggle[] = [
        {
          id: QuotationStatus.ACTIVE,
          title: 'translate it',
          active: true,
        },
        {
          id: QuotationStatus.INACTIVE,
          active: false,
          title: 'translate it',
          disabled: false,
        },
      ];
      expect(
        viewCasesSelectors.getViewToggles.projector(VIEW_CASE_STATE_MOCK)
      ).toEqual(expectedViewToggles);

      expect(translate).toHaveBeenCalledTimes(2);
      expect(translate).toHaveBeenCalledWith(
        'caseView.caseTable.viewToggle.openCases',
        { variable: 1 }
      );
      expect(translate).toHaveBeenCalledWith(
        'caseView.caseTable.viewToggle.deletedDrafts',
        { variable: 2 }
      );
    });
    test('should get view toggles with disabled inactive view', () => {
      const expectedViewToggles: ViewToggle[] = [
        {
          id: QuotationStatus.ACTIVE,
          active: true,
          title: 'translate it',
        },
        {
          id: QuotationStatus.INACTIVE,
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
            inactive: {
              count: 0,
              quotations: [],
            },
          },
        })
      ).toEqual(expectedViewToggles);

      expect(translate).toHaveBeenCalledTimes(2);
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
    test('should return QuotationStatus.ACTIVE 0', () => {
      expect(
        viewCasesSelectors.getDisplayStatus.projector(fakeState.viewCases)
      ).toBe(0);
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
