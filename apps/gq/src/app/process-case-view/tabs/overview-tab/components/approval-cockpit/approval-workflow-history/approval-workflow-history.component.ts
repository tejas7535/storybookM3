import { Component, Input } from '@angular/core';

import { ApprovalEventType, ApprovalWorkflowEvent } from '@gq/shared/models';
import { QuotationStatus } from '@gq/shared/models/quotation';

import { TRANSLOCO_DATE_PIPE_CONFIG } from '../approval-workflow-approver/consts/transloco-date-pipe-config';

@Component({
  selector: 'gq-approval-workflow-history',
  templateUrl: './approval-workflow-history.component.html',
  standalone: false,
})
export class ApprovalWorkflowHistoryComponent {
  @Input() quotationAutoApprovedEvent: ApprovalWorkflowEvent;
  @Input() quotationCancelledEvent: ApprovalWorkflowEvent;
  @Input() quotationRejectedEvent: ApprovalWorkflowEvent;
  @Input() quotationFinalReleaseEvent: ApprovalWorkflowEvent;
  @Input() receivedApprovalsOfRequiredApprovals: string;
  @Input() quotationStatus: QuotationStatus;

  startedEvent: ApprovalWorkflowEvent;
  filteredWorkflowEvents: ApprovalWorkflowEvent[];
  readonly quotationStatusEnum = QuotationStatus;
  readonly eventType = ApprovalEventType;
  readonly translocoDatePipeConfig = TRANSLOCO_DATE_PIPE_CONFIG;

  private _workflowEvents: ApprovalWorkflowEvent[];

  get workflowEvents(): ApprovalWorkflowEvent[] {
    return this._workflowEvents;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @Input()
  set workflowEvents(workflowEvents: ApprovalWorkflowEvent[]) {
    this._workflowEvents = workflowEvents;

    this.filteredWorkflowEvents =
      this.filterApprovalEventsForIterations(workflowEvents);

    this.startedEvent = workflowEvents?.slice().reverse()[0];
  }

  filterApprovalEventsForIterations(
    events: ApprovalWorkflowEvent[]
  ): ApprovalWorkflowEvent[] {
    if (!events) {
      return [];
    }

    const shallowCopy = [...events];

    // events are desc sorted, the last event, which is the very first STARTED/AUTO_APPROVED Event can be ignored
    // it will not be displayed in Iterations Section
    shallowCopy.pop();

    // RELEASED event and REJECT event with QuotationStatus.REJECTED can be ignored in the displayed list
    return shallowCopy.filter(
      (item: ApprovalWorkflowEvent) =>
        item.event !== ApprovalEventType.RELEASED &&
        item.quotationStatus !== QuotationStatus.REJECTED
    );
  }
}
