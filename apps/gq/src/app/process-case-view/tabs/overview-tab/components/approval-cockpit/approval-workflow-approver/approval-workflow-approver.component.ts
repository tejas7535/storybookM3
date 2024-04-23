import { Component, Input } from '@angular/core';

import {
  ApprovalEventType,
  ApprovalWorkflowEvent,
  Approver,
  QuotationStatus,
} from '@gq/shared/models';
import { TransformationService } from '@gq/shared/services/transformation/transformation.service';
import { TranslocoService } from '@jsverse/transloco';

import { APPROVAL_STATUS_OF_APPROVER_DISPLAY } from './consts/approval-status-display';
import { TRANSLOCO_DATE_PIPE_CONFIG } from './consts/transloco-date-pipe-config';

@Component({
  selector: 'gq-approval-workflow-approver',
  templateUrl: './approval-workflow-approver.component.html',
})
export class ApprovalWorkflowApproverComponent {
  @Input() approver: Approver;
  @Input() workflowEvent: ApprovalWorkflowEvent;
  @Input() quotationStatus: QuotationStatus;
  @Input() workflowInProgress: boolean;

  readonly displayStatus = APPROVAL_STATUS_OF_APPROVER_DISPLAY;
  readonly translocoDatePipeConfig = TRANSLOCO_DATE_PIPE_CONFIG;

  // have a colorSet of possible Colors and we randomly choose a Set
  // this is to not accidentally gender people wrong
  colorSetNumber: number = Math.floor(Math.random() * 5) + 1;
  constructor(
    readonly transformationService: TransformationService,
    readonly translationService: TranslocoService
  ) {}

  get eventComment(): string {
    return this.workflowEvent?.event === ApprovalEventType.FORWARDED
      ? this.translationService.translate(
          'processCaseView.tabs.overview.approvalCockpit.approvalStatusOfApprover.forwardedTo',
          { value: this.workflowEvent?.comment }
        )
      : // TODO: implement correctly
        this.workflowEvent?.comment;
  }

  get approvalStatusOfApprover(): string {
    // when there's no event for the approver, the approver hasn't done any action yet,
    // so status is IN_APPROVAL
    const isInApproval = !this.workflowEvent && this.workflowInProgress;

    if (this.quotationStatus === QuotationStatus.REJECTED && isInApproval) {
      return '';
    }

    if (isInApproval) {
      return APPROVAL_STATUS_OF_APPROVER_DISPLAY.IN_APPROVAL;
    }

    return APPROVAL_STATUS_OF_APPROVER_DISPLAY[this.workflowEvent?.event] ?? '';
  }
}
