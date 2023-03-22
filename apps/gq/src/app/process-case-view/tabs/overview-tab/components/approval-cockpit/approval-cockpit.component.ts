import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

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
      })
      .afterClosed()
      .subscribe(() => {
        // Will be implemented in a later story
      });
  }
}
