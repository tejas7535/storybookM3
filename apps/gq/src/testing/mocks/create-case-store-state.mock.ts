import { CaseState } from '../../app/core/store/reducers/create-case/create-case.reducer';

export const CREATE_CASE_STORE_STATE_MOCK: CaseState = {
  createCase: {
    autocompleteLoading: undefined,
    autocompleteItems: [],
    rowData: [],
  },
};
