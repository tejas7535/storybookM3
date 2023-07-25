import { Component } from '@angular/core';

import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { ApprovalEventType } from '@gq/shared/models';
import { QuotationStatus } from '@gq/shared/models/quotation';

@Component({
  selector: 'gq-approval-workflow-history',
  templateUrl: './approval-workflow-history.component.html',
})
export class ApprovalWorkflowHistoryComponent {
  readonly quotationStatus = QuotationStatus;
  readonly eventType = ApprovalEventType;

  constructor(readonly approvalFacade: ApprovalFacade) {}
}
