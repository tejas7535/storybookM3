import { ApprovalWorkflowEvent } from './approval-cockpit-data.model';
import { Approver } from './approver.model';

export interface ApprovalStatusOfRequestedApprover {
  approver: Approver;
  event: ApprovalWorkflowEvent;
}
