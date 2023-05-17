import { ApprovalLevel } from './approval-level.enum';

export interface ApprovalStatus {
  sapId: string;
  currency: string;
  approvalLevel: ApprovalLevel;
  approver3Required: boolean;
  autoApproval: boolean;
  netValue: number;
  gpm: number;
  deviation: number;
}
