import { GetQuotationsCountResponse } from '@gq/shared/services/rest/quotation/models/get-quotations-count-response.interface';

export const GET_QUOTATIONS_COUNT_MOCK: GetQuotationsCountResponse = {
  activeCount: 0,
  archivedCount: 0,
  inApprovalCount: 0,
  toApproveCount: 0,
  approvedCount: 0,
  rejectedCount: 0,
  sharedCount: 0,
};
