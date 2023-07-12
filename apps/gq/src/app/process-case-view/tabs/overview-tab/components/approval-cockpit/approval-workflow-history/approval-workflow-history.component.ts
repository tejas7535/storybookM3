import { Component } from '@angular/core';

import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { QuotationStatus } from '@gq/shared/models/quotation';

@Component({
  selector: 'gq-approval-workflow-history',
  templateUrl: './approval-workflow-history.component.html',
})
export class ApprovalWorkflowHistoryComponent {
  readonly quotationStatus = QuotationStatus;

  constructor(readonly approvalFacade: ApprovalFacade) {}
}
