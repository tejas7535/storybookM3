import { Component, Input } from '@angular/core';

import {
  ApprovalEventType,
  ApprovalWorkflowEvent,
  Approver,
  QuotationStatus,
} from '@gq/shared/models';
import { TransformationService } from '@gq/shared/services/transformation/transformation.service';
import { TranslocoService } from '@ngneat/transloco';

import { APPROVAL_STATUS_OF_APPROVER_DISPLAY } from './consts/approval-status-display';

@Component({
  selector: 'gq-approval-workflow-approver',
  templateUrl: './approval-workflow-approver.component.html',
})
export class ApprovalWorkflowApproverComponent {
  @Input() approver: Approver;
  @Input() workflowEvent: ApprovalWorkflowEvent;
  @Input() workflowInProgress: boolean;

  readonly displayStatus = APPROVAL_STATUS_OF_APPROVER_DISPLAY;
  readonly quotationStatus = QuotationStatus;

  // have a colorSet of possible Colors and we randomly choose a Set
  // this is to not accidentally gender people wrong
  colorSetNumber = Math.floor(Math.random() * 5) + 1;
  constructor(
    readonly transformationService: TransformationService,
    readonly translationService: TranslocoService
  ) {}

  get eventDate(): string {
    return this.workflowEvent?.event
      ? this.transformationService.transformDate(
          this.workflowEvent?.eventDate,
          true
        )
      : '';
  }

  get eventComment(): string {
    return this.workflowEvent?.event !== ApprovalEventType.FORWARDED
      ? this.workflowEvent?.comment
      : // TODO: implement correctly
        this.translationService.translate(
          'processCaseView.tabs.overview.approvalCockpit.approvalStatusOfApprover.forwardedTo',
          { value: this.workflowEvent?.comment }
        );
  }

  // check also comment in facade for workflowInProgress !!!
  // a workaround is implemented
  get approvalStatusOfApprover(): string {
    // when there's no event for the approver, the approver hasn't done any action yet,
    // so status is IN_APPROVAL
    if (!this.workflowEvent && this.workflowInProgress) {
      return APPROVAL_STATUS_OF_APPROVER_DISPLAY.IN_APPROVAL;
    }

    return APPROVAL_STATUS_OF_APPROVER_DISPLAY[this.workflowEvent?.event] ?? '';
  }
}
