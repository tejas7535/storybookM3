import { SqvApprovalStatus } from '@gq/shared/models/quotation-detail/cost/sqv-approval-status.enum';

export interface FindCalculatorsResponse {
  processVariables: {
    gqId: number;
    gqPositionId: string;
    approvalStatus: SqvApprovalStatus;
    foundCalculators: string[];
  };
}
