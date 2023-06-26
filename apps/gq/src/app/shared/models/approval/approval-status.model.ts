import { ApprovalLevel } from './approval-level.enum';

export interface ApprovalStatus {
  sapId: string;
  currency: string;
  approvalLevel: ApprovalLevel;
  thirdApproverRequired: boolean;
  autoApproval: boolean;
  totalNetValue: number;
  gpm: number;
  priceDeviation: number;
}
