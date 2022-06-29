import { CreateCaseState } from '../../../app/core/store/reducers/create-case/create-case.reducer';

export const CREATE_CASE_STORE_STATE_MOCK: CreateCaseState = {
  autocompleteLoading: undefined,
  autoSelectMaterial: undefined,
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
    materialSelection: { includeQuotationHistory: false, salesIndications: [] },
    historicalDataLimitInYear: 2,
  },
  createdCase: undefined,
  createCaseLoading: false,
  errorMessage: undefined,
  rowData: [],
  validationLoading: false,
};
