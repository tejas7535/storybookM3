import { QuotationTab } from '@gq/core/store/overview-cases/models/quotation-tab.enum';
import { OverviewCasesState } from '@gq/core/store/overview-cases/overview-cases.reducer';

export const VIEW_CASE_STATE_MOCK: OverviewCasesState = {
  quotationsCountLoading: false,
  quotationsLoading: false,
  quotations: {
    active: { count: 1, quotations: [] },
    activeTab: QuotationTab.ACTIVE,
    archived: { count: 2, quotations: [] },
    toApprove: { count: 1, quotations: [] },
    inApproval: { count: 1, quotations: [] },
    approved: { count: 1, quotations: [] },
    shared: { count: 1, quotations: [] },
    rejected: { count: 1, quotations: [] },
  },
  errorMessage: undefined,
  deleteLoading: true,
  selectedCases: [],
};
