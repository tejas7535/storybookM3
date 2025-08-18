import { SqvApprovalStatus } from '@gq/shared/models/quotation-detail/cost/sqv-approval-status.enum';

import { PositionAttachment } from './position-attachment.interface';

export interface UploadRfqSqvCheckApprovalResponse {
  uploads: PositionAttachment[];
  status: {
    processVariables: {
      approvalStatus: SqvApprovalStatus;
      gqPositionId: string;
    };
  };
}
