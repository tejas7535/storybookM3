import { Component } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';

import { ApprovalModalType } from '../../models';
import { ApprovalDecisionModalComponent } from '../approval-decision-modal/approval-decision-modal.component';

@Component({
  selector: 'gq-approval-cockpit',
  templateUrl: './approval-cockpit.component.html',
})
export class ApprovalCockpitComponent {
  constructor(
    private readonly matDialog: MatDialog,
    readonly approvalFacade: ApprovalFacade
  ) {}

  openApprovalDialog(): void {
    this.matDialog.open(ApprovalDecisionModalComponent, {
      width: '634px',
      data: {
        type: ApprovalModalType.APPROVE_CASE,
      },
    });
  }

  openRejectionDialog(): void {
    this.matDialog.open(ApprovalDecisionModalComponent, {
      width: '634px',
      data: {
        type: ApprovalModalType.REJECT_CASE,
      },
    });
  }
}
