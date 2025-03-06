import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { Subject, takeUntil } from 'rxjs';

import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { UpdateFunction } from '@gq/shared/models';

@Component({
  selector: 'gq-cancel-workflow-modal',
  templateUrl: './cancel-workflow-modal.component.html',
  standalone: false,
})
export class CancelWorkflowModalComponent implements OnInit, OnDestroy {
  private readonly shutdown$$: Subject<void> = new Subject();

  constructor(
    readonly approvalFacade: ApprovalFacade,
    private readonly dialogRef: MatDialogRef<CancelWorkflowModalComponent>
  ) {}

  ngOnInit(): void {
    this.approvalFacade.updateApprovalWorkflowSucceeded$
      .pipe(takeUntil(this.shutdown$$))
      .subscribe(() => this.closeDialog());
  }

  cancelApprovalWorkflow(): void {
    this.approvalFacade.updateApprovalWorkflow({
      updateFunction: UpdateFunction.CANCEL_WORKFLOW,
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.shutdown$$.next();
    this.shutdown$$.complete();
  }
}
