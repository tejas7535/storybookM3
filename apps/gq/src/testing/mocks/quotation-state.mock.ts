import { ProcessCaseState } from '../../app/core/store/reducers/process-case/process-case.reducer';

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
