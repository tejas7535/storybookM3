import { ApprovalWorkflowBaseInformation } from './approval-workflow-base-information.model';

export interface TriggerApprovalWorkflowRequest
  extends ApprovalWorkflowBaseInformation {
  gqLinkBase64Encoded: string;
}
