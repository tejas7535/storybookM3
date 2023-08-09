import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';

import { Subject, takeUntil } from 'rxjs';

import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { UpdateFunction } from '@gq/shared/models';
import { specialCharactersValidator } from '@gq/shared/validators/special-characters-validator';

import { ApprovalModalType } from '../../models';

interface ApprovalDecisionModalFormControl {
  comment: FormControl<string>;
}
@Component({
  templateUrl: './approval-decision-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovalDecisionModalComponent implements OnInit, OnDestroy {
  formGroup: FormGroup<ApprovalDecisionModalFormControl>;

  INPUT_MAX_LENGTH = 200;

  isInvalidInput = false;

  readonly approvalModalType = ApprovalModalType;

  private readonly shutdown$$: Subject<void> = new Subject();

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly modalData: { type: ApprovalModalType },
    private readonly dialogRef: MatDialogRef<ApprovalDecisionModalComponent>,
    private readonly formBuilder: FormBuilder,
    private readonly changeDetectorRef: ChangeDetectorRef,
    readonly approvalFacade: ApprovalFacade
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group<ApprovalDecisionModalFormControl>({
      comment: new FormControl(undefined, [
        specialCharactersValidator(),
        Validators.maxLength(this.INPUT_MAX_LENGTH),
      ]),
    });

    if (this.modalData.type === ApprovalModalType.REJECT_CASE) {
      this.formGroup.controls.comment.addValidators([Validators.required]);
    }

    this.approvalFacade.updateApprovalWorkflowSucceeded$
      .pipe(takeUntil(this.shutdown$$))
      .subscribe(() => this.closeDialog());
  }

  onPaste(event: ClipboardEvent): void {
    const pastedText = event.clipboardData?.getData('text/plain') || '';
    if (pastedText.length > this.INPUT_MAX_LENGTH) {
      this.isInvalidInput = true;

      // Clear the error after 3 seconds
      setTimeout(() => {
        this.isInvalidInput = false;
        this.changeDetectorRef.detectChanges();
      }, 3000);
    }
  }

  updateApprovalWorkflow(): void {
    if (this.formGroup.valid) {
      this.approvalFacade.updateApprovalWorkflow({
        updateFunction:
          this.modalData.type === ApprovalModalType.APPROVE_CASE
            ? UpdateFunction.APPROVE_QUOTATION
            : UpdateFunction.REJECT_QUOTATION,
        comment: this.formGroup.value.comment?.trim() || undefined,
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
}
