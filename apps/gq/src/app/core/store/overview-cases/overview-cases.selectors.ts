import {
  ACTIVE_STATUS_BAR_CONFIG,
  ARCHIVED_STATUS_BAR_CONFIG,
} from '@gq/case-view/case-table/config';
import { ExtendedViewToggle } from '@gq/case-view/models/extended-view-toggle';
import { AgStatusBar } from '@gq/shared/ag-grid/models/ag-status-bar.model';
import { ViewQuotation } from '@gq/shared/models/quotation';
import { QuotationStatus } from '@gq/shared/models/quotation/quotation-status.enum';
import { translate } from '@ngneat/transloco';
import { createSelector } from '@ngrx/store';

import { OverviewCasesStateQuotations } from './models/overview-cases-state-quotations.model';
import {
  overviewCasesFeature,
  OverviewCasesState,
} from './overview-cases.reducer';

export const getQuotations = createSelector(
  overviewCasesFeature.selectOverviewCasesState,
  (state: OverviewCasesState): ViewQuotation[] => {
    switch (state.quotations.displayStatus) {
      case QuotationStatus.ACTIVE:
        return state.quotations.active.quotations;
      case QuotationStatus.IN_APPROVAL:
        return state.quotations.inApproval.quotations;
      case QuotationStatus.APPROVED:
        return state.quotations.approved.quotations;
      case QuotationStatus.ARCHIVED:
        return state.quotations.archived.quotations;
      default:
        return undefined;
    }
  }
);

export const getStatusBarForQuotationStatus = createSelector(
  overviewCasesFeature.selectOverviewCasesState,
  (state: OverviewCasesState): AgStatusBar => {
    switch (state.quotations.displayStatus) {
      case QuotationStatus.ACTIVE:
        return ACTIVE_STATUS_BAR_CONFIG;
      case QuotationStatus.ARCHIVED:
        return ARCHIVED_STATUS_BAR_CONFIG;
      default:
        return { statusPanels: [] };
    }
  }
);

export const getViewToggles = createSelector(
  overviewCasesFeature.selectOverviewCasesState,
  (state: OverviewCasesState): ExtendedViewToggle[] => [
    {
      id: 0,
      status: QuotationStatus.ACTIVE,
      active: state.quotations.displayStatus === QuotationStatus.ACTIVE,
      title: translate('caseView.caseTable.viewToggle.openCases', {
        variable: state.quotations.active.count,
      }),
    },
    {
      id: 3,
      status: QuotationStatus.TO_BE_APPROVED,
      active: state.quotations.displayStatus === QuotationStatus.TO_BE_APPROVED,
      title: translate('caseView.caseTable.viewToggle.toBeApproved', {
        variable: state.quotations.toBeApproved?.count || 0,
      }),
      disabled: state.quotations.toBeApproved?.count === 0,
    },
    {
      id: 4,
      status: QuotationStatus.IN_APPROVAL,
      active: state.quotations.displayStatus === QuotationStatus.IN_APPROVAL,
      title: translate('caseView.caseTable.viewToggle.inApproval', {
        variable: state.quotations.inApproval?.count || 0,
      }),
      disabled: state.quotations.inApproval?.count === 0,
    },
    {
      id: 5,
      status: QuotationStatus.APPROVED,
      active: state.quotations.displayStatus === QuotationStatus.APPROVED,
      title: translate('caseView.caseTable.viewToggle.approved', {
        variable: state.quotations.approved?.count || 0,
      }),
      disabled: state.quotations.approved?.count === 0,
    },
    {
      id: 1,
      status: QuotationStatus.ARCHIVED,
      active: state.quotations.displayStatus === QuotationStatus.ARCHIVED,
      title: translate('caseView.caseTable.viewToggle.deletedDrafts', {
        variable: state.quotations.archived.count,
      }),
      disabled: state.quotations.archived.count === 0,
    },
  ]
);
export const getQuotationStatusFromView = (id: number) =>
  createSelector(
    getViewToggles,
    (viewToggles: ExtendedViewToggle[]) =>
      viewToggles.find((view) => view.id === id)?.status
  );

export const getDisplayStatus = createSelector(
  overviewCasesFeature.selectQuotations,
  (viewQuotations: OverviewCasesStateQuotations): QuotationStatus =>
    viewQuotations.displayStatus
);
