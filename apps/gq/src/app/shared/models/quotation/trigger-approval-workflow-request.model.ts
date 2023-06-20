export interface TriggerApprovalWorkflowRequest {
  gqId: number;
  firstApprover: string;
  secondApprover: string;
  thirdApprover: string;
  infoUser: string;
  comment: string;
  projectInformation: string;
  gqLinkBase64Encoded: string;
}
