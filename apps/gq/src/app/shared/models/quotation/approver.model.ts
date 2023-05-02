import { ApprovalLevel } from './approval-level.enum';

export interface Approver {
  userId: string;
  firstName: string;
  lastName: string;
  approvalLevel: ApprovalLevel;
}
