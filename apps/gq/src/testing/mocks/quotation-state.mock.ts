import { ProcessCaseState } from '../../app/core/store/reducers/process-case/process-case.reducers';

export const QUOTATION_STATE_MOCK: ProcessCaseState = {
  quotationIdentifier: undefined,
  customer: {
    customerLoading: false,
    item: undefined,
    errorMessage: undefined,
  },
  quotation: {
    quotationLoading: false,
    item: undefined,
    errorMessage: undefined,
  },
};
