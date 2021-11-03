import { ProcessCaseState } from '../../../app/core/store/reducers/process-case/process-case.reducer';
import { CUSTOMER_MOCK, QUOTATION_MOCK } from '../models';

export const PROCESS_CASE_STATE_MOCK: ProcessCaseState = {
  quotationIdentifier: undefined,
  customer: {
    customerLoading: false,
    item: CUSTOMER_MOCK,
    errorMessage: undefined,
  },
  quotation: {
    quotationLoading: false,
    item: QUOTATION_MOCK,
    selectedQuotationDetail: undefined,
    errorMessage: undefined,
    updateLoading: false,
  },
  addMaterials: {
    addMaterialRowData: [],
    validationLoading: false,
    removeQuotationDetailsIds: [],
    errorMessage: undefined,
  },
};
