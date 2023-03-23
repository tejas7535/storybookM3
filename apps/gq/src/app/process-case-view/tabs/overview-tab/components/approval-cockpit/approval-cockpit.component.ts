import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ApprovalModalType } from '../../models';
import { ApprovalDecisionModalComponent } from '../approval-decision-modal/approval-decision-modal.component';

@Component({
  selector: 'gq-approval-cockpit',
  templateUrl: './approval-cockpit.component.html',
})
export class ApprovalCockpitComponent {
  constructor(private readonly matDialog: MatDialog) {}

  public openApprovalDialog(): void {
    this.matDialog
      .open(ApprovalDecisionModalComponent, {
        width: '634px',
        data: {
          type: ApprovalModalType.APPROVE_CASE,
        },
      })
      .afterClosed()
      .subscribe(() => {
        // Will be implemented in a later story
      });
  }

  public openRejectionDialog(): void {
    this.matDialog
      .open(ApprovalDecisionModalComponent, {
        width: '634px',
        data: {
          type: ApprovalModalType.REJECT_CASE,
        },
      })
      .afterClosed()
      .subscribe(() => {
        // Will be implemented in a later story
      });
  }
}
