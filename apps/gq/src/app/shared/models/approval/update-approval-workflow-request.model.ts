export interface UpdateApprovalWorkflowRequest {
  gqId: number;
  comment?: string;
  updateFunction: UpdateFunction;
  forwardTo?: string;
}

export enum UpdateFunction {
  APPROVE_QUOTATION = 'APPROVE_QUOTATION',
  REJECT_QUOTATION = 'REJECT_QUOTATION',
  FORWARD_WF_ITEM = 'FORWARD_WF_ITEM',
  CANCEL_WORKFLOW = 'CANCEL_WORKFLOW',
}
