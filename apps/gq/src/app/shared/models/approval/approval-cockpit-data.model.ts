import { QuotationStatus } from '../quotation/quotation-status.enum';
import { ApprovalEventType } from './approval-event-type.enum';

export interface ApprovalCockpitData {
  approvalGeneral: ApprovalWorkflowInformation;
  approvalEvents: ApprovalWorkflowEvent[];
}

export interface ApprovalWorkflowInformation {
  gqId: number;
  sapId: string;
  currency: string;
  autoApproval: boolean;
  firstApprover: string;
  secondApprover: string;
  thirdApprover: string;
  thirdApproverRequired: boolean;
  approverInformation: string;
  comment: string;
  projectInformation: string;
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
}
