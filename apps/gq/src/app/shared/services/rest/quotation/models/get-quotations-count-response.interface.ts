export interface GetQuotationsCountResponse {
  activeCount: number;
  inApprovalCount: number;
  toApproveCount: number;
  approvedCount: number;
  archivedCount: number;
  rejectedCount: number;
  sharedCount: number;
}
