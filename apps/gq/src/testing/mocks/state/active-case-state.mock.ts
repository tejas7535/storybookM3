import { ActiveCaseState } from '@gq/core/store/active-case/active-case.reducer';

import { CUSTOMER_MOCK } from '../models';
import { QUOTATION_MOCK } from '../models/quotation/quotation.mock';

export const ACTIVE_CASE_STATE_MOCK: ActiveCaseState = {
  quotationIdentifier: undefined,
  customerLoading: false,
  customer: CUSTOMER_MOCK,
  customerLoadingErrorMessage: undefined,

  quotationMetadataLoading: false,
  quotationMetadataLoadingErrorMessage: undefined,

  quotationLoading: false,
  quotationPricingOverview: undefined,
  quotationPricingOverviewErrorMessage: undefined,
  quotationPricingOverviewLoading: false,
  selectedQuotationDetail: undefined,
  quotationLoadingErrorMessage: undefined,
  updateLoading: false,
  detailsSyncingToSap: [],
  selectedQuotationDetails: [],
  quotation: QUOTATION_MOCK,
  removeQuotationDetailsIds: [],
  simulationData: undefined,
  simulatedItem: undefined,
  updateCostsLoading: false,
  updateRfqInformationLoading: false,
  attachmentsUploading: false,
  attachmentsLoading: false,
  attachments: [],
  attachmentErrorMessage: undefined,
  attachmentDeletionInProgress: false,
  sapSyncStatusErrorMessage: undefined,
};
