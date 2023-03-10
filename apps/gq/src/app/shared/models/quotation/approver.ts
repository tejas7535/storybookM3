import { ApprovalLevel } from './approvalLevel.enum';

export interface Approver {
  id: string;
  firstName: string;
  lastName: string;
  approvalLevel: ApprovalLevel;
}
