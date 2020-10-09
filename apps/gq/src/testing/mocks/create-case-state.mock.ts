import { CaseState } from '../../app/core/store/reducers/create-case/create-case.reducer';

export const CREATE_CASE_MOCK: CaseState = {
  createCase: {
    autocompleteLoading: undefined,
    quotation: {
      options: [],
    },
    customer: {
      options: [],
      items: [],
    },
  },
};
