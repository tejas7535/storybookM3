import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { Subject, takeUntil } from 'rxjs';

import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { Approver, UpdateFunction } from '@gq/shared/models';
import { userValidator } from '@gq/shared/validators/user-validator';
import { translate } from '@jsverse/transloco';

@Component({
  selector: 'gq-forward-approval-workflow-modal',
  templateUrl: './forward-approval-workflow-modal.component.html',
})
export class ForwardApprovalWorkflowModalComponent
  implements OnInit, OnDestroy
{
  approverFormControl = new FormControl<Approver>(
    undefined,
    Validators.compose([userValidator().bind(this), Validators.required])
  );

  errorMessage: string;

  private readonly REQUIRED_APPROVER_ERROR_MESSAGE = translate(
    'processCaseView.tabs.overview.approvalCockpit.forwardApprovalWorkflowModal.requiredApproverError'
  );
  private readonly INVALID_APPROVER_ERROR_MESSAGE = translate(
    'processCaseView.tabs.overview.approvalCockpit.forwardApprovalWorkflowModal.invalidApproverError'
  );

  private readonly shutdown$$: Subject<void> = new Subject();

  constructor(
    readonly approvalFacade: ApprovalFacade,
    private readonly dialogRef: MatDialogRef<ForwardApprovalWorkflowModalComponent>
  ) {}

  ngOnInit(): void {
    this.initErrorMessage();

    this.approvalFacade.updateApprovalWorkflowSucceeded$
      .pipe(takeUntil(this.shutdown$$))
      .subscribe(() => this.closeDialog());
  }

  forwardApprovalWorkflow(): void {
    if (this.approverFormControl.valid) {
      this.approvalFacade.updateApprovalWorkflow({
        updateFunction: UpdateFunction.FORWARD_WF_ITEM,
        forwardTo: this.approverFormControl.value.userId,
      });
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.shutdown$$.next();
    this.shutdown$$.complete();
  }

  private initErrorMessage(): void {
    // Since the initial value of the form control is undefined, there is always "required" validation error initially
    // and the error message needs to be initialized with REQUIRED_APPROVER_ERROR_MESSAGE.
    // However, the error message will be displayed, only after the field is touched.
    this.errorMessage = this.REQUIRED_APPROVER_ERROR_MESSAGE;

    this.approverFormControl.statusChanges
      .pipe(takeUntil(this.shutdown$$))
      .subscribe(() => (this.errorMessage = this.getErrorMessage()));
  }

  private getErrorMessage(): string {
    if (this.approverFormControl.hasError('required')) {
      return this.REQUIRED_APPROVER_ERROR_MESSAGE;
    }

    if (this.approverFormControl.hasError('invalidUser')) {
      return this.INVALID_APPROVER_ERROR_MESSAGE;
    }

    return '';
  }
}
