import { QuotationStatus } from '../quotation/quotation-status.enum';
import { ApprovalEventType } from './approval-event-type.enum';
import { ApprovalLevel } from './approval-level.enum';
import { ApprovalWorkflowBaseInformation } from './approval-workflow-base-information.model';
import { Approver } from './approver.model';

export interface ApprovalCockpitData {
  approvalGeneral: ApprovalWorkflowInformation;
  approvalEvents: ApprovalWorkflowEvent[];
}

export interface ApprovalWorkflowInformation
  extends ApprovalWorkflowBaseInformation {
  sapId: string;
  approvalLevel: ApprovalLevel;
  currency: string;
  autoApproval: boolean;
  thirdApproverRequired: boolean;
  totalNetValue: number;
  gpm: number;
  priceDeviation: number;
}

export interface ApprovalWorkflowEvent {
  gqId: number;
  sapId: string;
  userId: string;
  eventDate: string;
  quotationStatus: QuotationStatus;
  event: ApprovalEventType;
  comment: string;
  verified: boolean;
  // FE property only
  user: Approver;
}
