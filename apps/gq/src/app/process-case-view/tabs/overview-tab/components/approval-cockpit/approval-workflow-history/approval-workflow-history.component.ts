import { Component, Input } from '@angular/core';

import { ApprovalEventType, ApprovalWorkflowEvent } from '@gq/shared/models';
import { QuotationStatus } from '@gq/shared/models/quotation';

import { TRANSLOCO_DATE_PIPE_CONFIG } from '../approval-workflow-approver/consts/transloco-date-pipe-config';

@Component({
  selector: 'gq-approval-workflow-history',
  templateUrl: './approval-workflow-history.component.html',
})
export class ApprovalWorkflowHistoryComponent {
  @Input() quotationAutoApprovedEvent: ApprovalWorkflowEvent;
  @Input() quotationCancelledEvent: ApprovalWorkflowEvent;
  @Input() quotationRejectedEvent: ApprovalWorkflowEvent;
  @Input() quotationFinalReleaseEvent: ApprovalWorkflowEvent;
  @Input() receivedApprovalsOfRequiredApprovals: string;
  @Input() quotationStatus: QuotationStatus;

  workflowEventsAsc: ApprovalWorkflowEvent[];

  readonly quotationStatusEnum = QuotationStatus;
  readonly eventType = ApprovalEventType;
  readonly translocoDatePipeConfig = TRANSLOCO_DATE_PIPE_CONFIG;

  private _workflowEvents: ApprovalWorkflowEvent[];

  get workflowEvents(): ApprovalWorkflowEvent[] {
    return this._workflowEvents;
  }

  @Input()
  set workflowEvents(workflowEvents: ApprovalWorkflowEvent[]) {
    this._workflowEvents = workflowEvents;
    this.workflowEventsAsc = workflowEvents?.slice().reverse();
  }
}
