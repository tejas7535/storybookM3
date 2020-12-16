import { dummyRowData } from '../../app/core/store/reducers/create-case/config/dummy-row-data';
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
    errorMessage: undefined,
    updateDetails: undefined,
  },
  addMaterials: {
    addMaterialRowData: [dummyRowData],
    validationLoading: false,
    removeQuotationDetailsIds: [],
    errorMessage: undefined,
  },
};
