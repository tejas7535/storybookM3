import { ApprovalState } from '@gq/core/store/approval/approval.reducer';
import { ApprovalLevel } from '@gq/shared/models/quotation/approval-level.enum';

export const APPROVAL_STATE_MOCK: ApprovalState = {
  approvers: [
    {
      userId: 'herpisef',
      firstName: 'Stefan',
      lastName: 'Herpich',
      approvalLevel: ApprovalLevel.L1,
    },
    {
      userId: 'schlesni',
      firstName: 'Stefanie',
      lastName: 'Schleer',
      approvalLevel: ApprovalLevel.L2,
    },
    {
      userId: 'fischjny',
      firstName: 'Jenny',
      lastName: 'Fischer',
      approvalLevel: ApprovalLevel.L3,
    },
    {
      userId: 'soehnpsc',
      firstName: 'Pascal',
      lastName: 'Soehnlein',
      approvalLevel: ApprovalLevel.L4,
    },
    {
      userId: 'anyId',
      firstName: 'Jan',
      lastName: 'Schmitt',
      approvalLevel: ApprovalLevel.L5,
    },
  ],
} as ApprovalState;
