import {
  ACTIVE_STATUS_BAR_CONFIG,
  ARCHIVED_STATUS_BAR_CONFIG,
} from '@gq/case-view/case-table/config';
import { ExtendedViewToggle } from '@gq/case-view/models/extended-view-toggle';
import { AgStatusBar } from '@gq/shared/ag-grid/models/ag-status-bar.model';
import { ViewQuotation } from '@gq/shared/models/quotation';
import { translate } from '@ngneat/transloco';
import { createSelector } from '@ngrx/store';

import { OverviewCasesStateQuotations } from './models/overview-cases-state-quotations.model';
import { QuotationTab } from './models/quotation-tab.enum';
import {
  overviewCasesFeature,
  OverviewCasesState,
} from './overview-cases.reducer';

export const getQuotations = createSelector(
  overviewCasesFeature.selectOverviewCasesState,
  (state: OverviewCasesState): ViewQuotation[] => {
    switch (state.quotations.activeTab) {
      case QuotationTab.ACTIVE:
        return state.quotations.active.quotations;
      case QuotationTab.IN_APPROVAL:
        return state.quotations.inApproval.quotations;
      case QuotationTab.APPROVED:
        return state.quotations.approved.quotations;
      case QuotationTab.ARCHIVED:
        return state.quotations.archived.quotations;
      case QuotationTab.TO_APPROVE:
        return state.quotations.toApprove.quotations;
      case QuotationTab.REJECTED:
        return state.quotations.rejected.quotations;
      case QuotationTab.SHARED:
        return state.quotations.shared.quotations;
      default:
        return undefined;
    }
  }
);

export const getStatusBarForQuotationStatus = createSelector(
  overviewCasesFeature.selectOverviewCasesState,
  (state: OverviewCasesState): AgStatusBar => {
    switch (state.quotations.activeTab) {
      case QuotationTab.ACTIVE:
        return ACTIVE_STATUS_BAR_CONFIG;
      case QuotationTab.ARCHIVED:
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
      tab: QuotationTab.ACTIVE,
      active: state.quotations.activeTab === QuotationTab.ACTIVE,
      title: translate('caseView.caseTable.viewToggle.openCases', {
        variable: state.quotations.active.count,
      }),
    },
    {
      id: 1,
      tab: QuotationTab.TO_APPROVE,
      active: state.quotations.activeTab === QuotationTab.TO_APPROVE,
      title: translate('caseView.caseTable.viewToggle.toApprove', {
        variable: state.quotations.toApprove?.count || 0,
      }),
      disabled: state.quotations.toApprove?.count === 0,
    },
    {
      id: 2,
      tab: QuotationTab.IN_APPROVAL,
      active: state.quotations.activeTab === QuotationTab.IN_APPROVAL,
      title: translate('caseView.caseTable.viewToggle.inApproval', {
        variable: state.quotations.inApproval?.count || 0,
      }),
      disabled: state.quotations.inApproval?.count === 0,
    },
    {
      id: 3,
      tab: QuotationTab.APPROVED,
      active: state.quotations.activeTab === QuotationTab.APPROVED,
      title: translate('caseView.caseTable.viewToggle.approved', {
        variable: state.quotations.approved?.count || 0,
      }),
      disabled: state.quotations.approved?.count === 0,
    },
    {
      id: 4,
      tab: QuotationTab.REJECTED,
      active: state.quotations.activeTab === QuotationTab.REJECTED,
      title: translate('caseView.caseTable.viewToggle.rejected', {
        variable: state.quotations.rejected.count,
      }),
      disabled: state.quotations.rejected.count === 0,
    },
    {
      id: 5,
      tab: QuotationTab.SHARED,
      active: state.quotations.activeTab === QuotationTab.SHARED,
      title: translate('caseView.caseTable.viewToggle.shared', {
        variable: state.quotations.shared?.count || 0,
      }),
      disabled: state.quotations.shared?.count === 0,
    },
    {
      id: 6,
      tab: QuotationTab.ARCHIVED,
      active: state.quotations.activeTab === QuotationTab.ARCHIVED,
      title: translate('caseView.caseTable.viewToggle.deletedDrafts', {
        variable: state.quotations.archived.count,
      }),
      disabled: state.quotations.archived.count === 0,
    },
  ]
);
export const getQuotationTabFromView = (id: number) =>
  createSelector(
    getViewToggles,
    (viewToggles: ExtendedViewToggle[]) =>
      viewToggles.find((view) => view.id === id)?.tab
  );

export const getActiveTab = createSelector(
  overviewCasesFeature.selectQuotations,
  (viewQuotations: OverviewCasesStateQuotations): QuotationTab =>
    viewQuotations.activeTab
);
