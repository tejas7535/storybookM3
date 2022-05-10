import { ViewCasesState } from '../../../app/core/store/reducers/view-cases/view-cases.reducer';

export const VIEW_CASE_STATE_MOCK: ViewCasesState = {
  quotationsLoading: false,
  quotations: undefined,
  errorMessage: undefined,
  deleteLoading: false,
  selectedCases: [],
};
