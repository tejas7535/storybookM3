import { CaseState } from '../../app/core/store/reducers/create-case/create-case.reducer';

export const CREATE_CASE_STORE_STATE_MOCK: CaseState = {
  autocompleteLoading: undefined,
  autocompleteItems: [],
  customer: {
    customerId: undefined,
    salesOrgs: undefined,
    errorMessage: undefined,
    salesOrgsLoading: false,
  },
  plSeries: {
    errorMessage: undefined,
    loading: false,
    plsAndSeries: { series: [], pls: [] },
  },
  createdCase: undefined,
  createCaseLoading: false,
  errorMessage: undefined,
  rowData: [],
  validationLoading: false,
};
