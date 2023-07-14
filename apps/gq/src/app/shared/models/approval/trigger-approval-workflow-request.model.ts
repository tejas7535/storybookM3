import { ApprovalWorkflowInformation } from './approval-cockpit-data.model';

export interface TriggerApprovalWorkflowRequest
  extends Omit<ApprovalWorkflowInformation, 'sapId'> {
  gqLinkBase64Encoded: string;
}
