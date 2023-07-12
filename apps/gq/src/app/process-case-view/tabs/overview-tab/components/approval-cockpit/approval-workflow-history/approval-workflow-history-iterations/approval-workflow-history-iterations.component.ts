import { Component } from '@angular/core';

import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { QuotationStatus } from '@gq/shared/models/quotation/quotation-status.enum';

@Component({
  selector: 'gq-approval-workflow-history-iterations',
  templateUrl: './approval-workflow-history-iterations.component.html',
})
export class ApprovalWorkflowHistoryIterationsComponent {
  readonly quotationStatus = QuotationStatus;
  iterationVisible = false;
  constructor(readonly approvalFacade: ApprovalFacade) {}

  toggleIteration(): void {
    this.iterationVisible = !this.iterationVisible;
  }
}
