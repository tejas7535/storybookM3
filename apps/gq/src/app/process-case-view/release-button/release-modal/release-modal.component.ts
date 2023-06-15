import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { combineLatest, map, Observable, Subject, takeUntil, tap } from 'rxjs';

import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { Quotation } from '@gq/shared/models';
import { ApprovalStatus } from '@gq/shared/models/quotation';
import { ApprovalLevel } from '@gq/shared/models/quotation/approval-level.enum';
import { approverValidator } from '@gq/shared/validators/approver-validator';
import { approversDifferValidator } from '@gq/shared/validators/approvers-differ-validator';
import { TranslocoService } from '@ngneat/transloco';
@Component({
  selector: 'gq-release-modal',
  templateUrl: './release-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReleaseModalComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;

  INPUT_MAX_LENGTH = 1000;
  readonly approvalLevelEnum = ApprovalLevel;

  approver1FormControl = new FormControl(
    '',
    Validators.compose([approverValidator().bind(this), Validators.required])
  );

  approver2FormControl = new FormControl(
    '',
    Validators.compose([approverValidator().bind(this), Validators.required])
  );

  approver3FormControl = new FormControl(
    '',
    Validators.compose([approverValidator().bind(this), Validators.required])
  );
  approverCCFormControl = new FormControl('');

  dataLoadingComplete$: Observable<boolean>; // = NEVER;

  private readonly REQUIRED_ERROR_MESSAGE = '';
  private readonly INVALID_APPROVER_ERROR_MESSAGE = '';

  private readonly shutdown$$: Subject<void> = new Subject<void>();

  constructor(
    public readonly approvalFacade: ApprovalFacade,
    @Inject(MAT_DIALOG_DATA)
    public dialogData: Quotation,
    private readonly dialogRef: MatDialogRef<ReleaseModalComponent>,
    private readonly formBuilder: FormBuilder,
    private readonly translocoService: TranslocoService
  ) {
    this.REQUIRED_ERROR_MESSAGE = this.translocoService.translate(
      'processCaseView.header.releaseModal.requiredError'
    );
    this.INVALID_APPROVER_ERROR_MESSAGE = this.translocoService.translate(
      'processCaseView.header.releaseModal.invalidApproverError'
    );
  }

  ngOnInit(): void {
    this.approvalFacade.getApprovalWorkflowData(this.dialogData.sapId);

    this.dataLoadingComplete$ = combineLatest([
      this.approvalFacade.allApproversLoading$,
      this.approvalFacade.approvalStatusLoading$,
      this.approvalFacade.approvalStatus$,
    ]).pipe(
      takeUntil(this.shutdown$$),
      map(
        ([loadingAllApprovers, loadingApprovalStatus, approvalStatus]: [
          boolean,
          boolean,
          ApprovalStatus
        ]) =>
          !loadingAllApprovers &&
          !loadingApprovalStatus &&
          !!approvalStatus.sapId
      )
    );

    this.formGroup = this.formBuilder.group(
      {
        approver1: this.approver1FormControl,
        approver2: this.approver2FormControl,
        approverCC: this.approverCCFormControl,
        comment: ['', Validators.maxLength(this.INPUT_MAX_LENGTH)],
        projectInformation: ['', Validators.maxLength(this.INPUT_MAX_LENGTH)],
      },
      { validators: approversDifferValidator().bind(this) }
    );

    this.approvalFacade.approvalStatus$
      .pipe(
        takeUntil(this.shutdown$$),
        tap(({ thirdApproverRequired }: ApprovalStatus) => {
          if (thirdApproverRequired) {
            this.formGroup.addControl('approver3', this.approver3FormControl);
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.shutdown$$.next();
    this.shutdown$$.complete();
  }

  getErrorMessageOfControl(control: AbstractControl): string {
    if (control.hasError('required')) {
      return this.REQUIRED_ERROR_MESSAGE;
    }

    if (control.hasError('invalidApprover')) {
      return this.INVALID_APPROVER_ERROR_MESSAGE;
    }

    return '';
  }

  startWorkflow() {
    // Will be implemented in a later story
  }
  triggerAutoApproval() {
    // Will be implemented in a later story
  }

  save() {
    // Will be implemented in a later story
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
