import { ProcessCaseState } from '../../../app/core/store/reducers/process-case/process-case.reducer';
import { SAP_SYNC_STATUS } from '../../../app/shared/models/quotation-detail';
import { CUSTOMER_MOCK, QUOTATION_MOCK } from '../models';

export const PROCESS_CASE_STATE_MOCK: ProcessCaseState = {
  quotationIdentifier: undefined,
  customer: {
    customerLoading: false,
    item: CUSTOMER_MOCK,
    errorMessage: undefined,
  },
  quotation: {
    sapSyncStatus: SAP_SYNC_STATUS.NOT_SYNCED,
    quotationLoading: false,
    item: QUOTATION_MOCK,
    selectedQuotationDetail: undefined,
    errorMessage: undefined,
    updateLoading: false,
    selectedQuotationDetails: [],
  },
  addMaterials: {
    addMaterialRowData: [],
    validationLoading: false,
    removeQuotationDetailsIds: [],
    errorMessage: undefined,
  },
};
