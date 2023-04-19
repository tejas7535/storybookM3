import { ApprovalLevel } from './approval-level.enum';

export interface Approver {
  id: string;
  firstName: string;
  lastName: string;
  approvalLevel: ApprovalLevel;
}
