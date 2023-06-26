import { QuotationStatus } from '@gq/shared/models';

export interface ApprovalEvent {
  gqId: number;
  sapId: string;
  userId: string;
  eventDate: string;
  quotationStatus: QuotationStatus;
  event: ApprovalEventType;
  comment: string;
  verified: boolean;
}

export enum ApprovalEventType {
  APPROVED = 'APPROVED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
  STARTED = 'STARTED',
  FORWARDED = 'FORWARDED',
  AUTO_APPROVAL = 'AUTO_APPROVAL',
}
