import { translate } from '@ngneat/transloco';
import { createSelector } from '@ngrx/store';

import { ViewToggle } from '@schaeffler/view-toggle';

import {
  ACTIVE_STATUS_BAR_CONFIG,
  INACTIVE_STATUS_BAR_CONFIG,
} from '../../../../case-view/case-table/config';
import { AgStatusBar } from '../../../../shared/ag-grid/models/ag-status-bar.model';
import { ViewQuotation } from '../../../../shared/models/quotation';
import { QuotationStatus } from '../../../../shared/models/quotation/quotation-status.enum';
import { getViewCasesState } from '../../reducers';
import { ViewCasesState } from '../../reducers/view-cases/view-cases.reducer';

export const getQuotations = createSelector(
  getViewCasesState,
  (state: ViewCasesState): ViewQuotation[] => {
    switch (state.quotations.displayStatus) {
      case QuotationStatus.ACTIVE:
        return state.quotations.active.quotations;
      case QuotationStatus.INACTIVE:
        return state.quotations.inactive.quotations;
      default:
        return undefined;
    }
  }
);

export const getStatusBarForQuotationStatus = createSelector(
  getViewCasesState,
  (state: ViewCasesState): AgStatusBar => {
    switch (state.quotations.displayStatus) {
      case QuotationStatus.ACTIVE:
        return ACTIVE_STATUS_BAR_CONFIG;
      case QuotationStatus.INACTIVE:
        return INACTIVE_STATUS_BAR_CONFIG;
      default:
        return { statusPanels: [] };
    }
  }
);

export const getViewToggles = createSelector(
  getViewCasesState,
  (state: ViewCasesState): ViewToggle[] => [
    {
      id: QuotationStatus.ACTIVE,
      active: state.quotations.displayStatus === QuotationStatus.ACTIVE,
      title: translate('caseView.caseTable.viewToggle.openCases', {
        variable: state.quotations.active.count,
      }),
    },
    {
      id: QuotationStatus.TO_BE_APPROVED,
      active: state.quotations.displayStatus === QuotationStatus.TO_BE_APPROVED,
      title: translate('caseView.caseTable.viewToggle.toBeApproved', {
        variable: state.quotations.toBeApproved?.count || 0,
      }),
      disabled: state.quotations.toBeApproved?.count === 0,
    },
    {
      id: QuotationStatus.IN_APPROVAL,
      active: state.quotations.displayStatus === QuotationStatus.IN_APPROVAL,
      title: translate('caseView.caseTable.viewToggle.inApproval', {
        variable: state.quotations.inApproval?.count || 0,
      }),
      disabled: state.quotations.inApproval?.count === 0,
    },
    {
      id: QuotationStatus.APPROVED,
      active: state.quotations.displayStatus === QuotationStatus.APPROVED,
      title: translate('caseView.caseTable.viewToggle.approved', {
        variable: state.quotations.approved?.count || 0,
      }),
      disabled: state.quotations.approved?.count === 0,
    },
    {
      id: QuotationStatus.INACTIVE,
      active: state.quotations.displayStatus === QuotationStatus.INACTIVE,
      title: translate('caseView.caseTable.viewToggle.deletedDrafts', {
        variable: state.quotations.inactive.count,
      }),
      disabled: state.quotations.inactive.count === 0,
    },
  ]
);

export const getDisplayStatus = createSelector(
  getViewCasesState,
  (state: ViewCasesState): QuotationStatus => state.quotations.displayStatus
);

export const getQuotationsLoading = createSelector(
  getViewCasesState,
  (state: ViewCasesState): boolean => state.quotationsLoading
);

export const getDeleteLoading = createSelector(
  getViewCasesState,
  (state: ViewCasesState): boolean => state.deleteLoading
);

export const getSelectedCaseIds = createSelector(
  getViewCasesState,
  (state: ViewCasesState): number[] => state?.selectedCases
);
