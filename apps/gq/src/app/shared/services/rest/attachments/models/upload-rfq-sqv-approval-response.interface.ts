import { SqvApprovalStatus } from '@gq/shared/models/quotation-detail/cost/sqv-approval-status.enum';

import { Attachment } from './attachment.interface';

export interface UploadRfqSqvCheckApprovalResponse {
  uploads: Attachment[];
  status: {
    processVariables: {
      approvalStatus: SqvApprovalStatus;
      gqPositionId: string;
    };
  };
}
