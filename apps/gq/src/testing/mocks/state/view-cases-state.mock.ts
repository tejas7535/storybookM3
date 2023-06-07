import { OverviewCasesState } from '@gq/core/store/overview-cases/overview-cases.reducer';
import { QuotationStatus } from '@gq/shared/models/quotation/quotation-status.enum';

export const VIEW_CASE_STATE_MOCK: OverviewCasesState = {
  quotationsLoading: false,
  quotations: {
    active: { count: 1, quotations: [] },
    displayStatus: QuotationStatus.ACTIVE,
    archived: { count: 2, quotations: [] },
    toBeApproved: { count: 1, quotations: [] },
    inApproval: { count: 1, quotations: [] },
    approved: { count: 1, quotations: [] },
  },
  errorMessage: undefined,
  deleteLoading: true,
  selectedCases: [],
};
