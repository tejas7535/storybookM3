import { ActiveCaseState } from '@gq/core/store/active-case/active-case.reducer';

import { CUSTOMER_MOCK, QUOTATION_MOCK } from '../models';

export const ACTIVE_CASE_STATE_MOCK: ActiveCaseState = {
  quotationIdentifier: undefined,
  customerLoading: false,
  customer: CUSTOMER_MOCK,
  customerLoadingErrorMessage: undefined,

  quotationLoading: false,
  selectedQuotationDetail: undefined,
  quotationLoadingErrorMessage: undefined,
  updateLoading: false,
  selectedQuotationDetails: [],
  quotation: QUOTATION_MOCK,
  removeQuotationDetailsIds: [],
  simulatedItem: undefined,
  updateCostsLoading: false,
  attachmentsUploading: false,
  attachmentsGetting: false,
  attachments: [],
};
