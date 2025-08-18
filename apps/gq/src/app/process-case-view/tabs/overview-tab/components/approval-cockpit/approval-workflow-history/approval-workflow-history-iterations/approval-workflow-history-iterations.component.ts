import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { TRANSLOCO_DATE_PIPE_CONFIG } from '@gq/shared/constants/transloco-date-pipe-config';
import {
  ApprovalEventType,
  ApprovalWorkflowEvent,
} from '@gq/shared/models/approval';
import { QuotationStatus } from '@gq/shared/models/quotation/quotation-status.enum';

@Component({
  selector: 'gq-approval-workflow-history-iterations',
  templateUrl: './approval-workflow-history-iterations.component.html',
  standalone: false,
})
export class ApprovalWorkflowHistoryIterationsComponent implements OnChanges {
  @Input() isApproved = false;
  @Input() inApproval = false;
  @Input() rejectedEvent: ApprovalWorkflowEvent = undefined;
  @Input() cancelledEvent: ApprovalWorkflowEvent = undefined;
  @Input() autoApprovedEvent: ApprovalWorkflowEvent = undefined;
  @Input() workflowEvents: ApprovalWorkflowEvent[] = [];
  @Input() receivedApprovalsOfRequiredApprovals = '';

  readonly quotationStatus = QuotationStatus;
  readonly eventType = ApprovalEventType;
  readonly translocoDatePipeConfig = TRANSLOCO_DATE_PIPE_CONFIG;

  iterationVisible = false;
  iconColor = '';

  toggleIteration(): void {
    this.iterationVisible = !this.iterationVisible;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isApproved || changes.rejectedEvent || changes.cancelledEvent) {
      this.iconColor = this.getIconColor(
        changes.isApproved?.currentValue,
        changes.rejectedEvent?.currentValue,
        changes.cancelledEvent?.currentValue
      );
    }
  }

  private getIconColor(
    isApproved: boolean,
    rejectedEvent: ApprovalWorkflowEvent,
    cancelledEvent: ApprovalWorkflowEvent
  ): string {
    if (isApproved) {
      return 'text-icon-success';
    }
    if (rejectedEvent || cancelledEvent) {
      return 'text-icon-error';
    }

    return '';
  }
}
