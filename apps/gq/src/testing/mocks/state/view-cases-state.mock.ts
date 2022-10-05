import { ViewCasesState } from '../../../app/core/store/reducers/view-cases/view-cases.reducer';
import { QuotationStatus } from '../../../app/shared/models/quotation/quotation-status.enum';

export const VIEW_CASE_STATE_MOCK: ViewCasesState = {
  quotationsLoading: false,
  quotations: {
    active: { count: 1, quotations: [] },
    displayStatus: QuotationStatus.ACTIVE,
    inactive: { count: 2, quotations: [] },
  },
  errorMessage: undefined,
  deleteLoading: true,
  selectedCases: [],
};
