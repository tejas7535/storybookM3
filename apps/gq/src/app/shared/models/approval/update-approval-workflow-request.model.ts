export interface UpdateApprovalWorkflowRequest {
  gqId: number;
  comment?: string;
  updateFunction: UpdateFunction;
  forwardTo?: string;
}

export enum UpdateFunction {
  APPROVE_QUOTATION = 'ApproveQuotation',
  REJECT_QUOTATION = 'RejectQuotation',
  FORWARD_WF_ITEM = 'ForwardWFItem',
  CANCEL_WORKFLOW = 'CANCEL_WF',
}
