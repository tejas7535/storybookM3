import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ApprovalModalType } from '../../models';

@Component({
  templateUrl: './approval-decision-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovalDecisionModalComponent implements OnInit {
  formGroup: FormGroup;

  INPUT_MAX_LENGTH = 200;

  approvalModalType = ApprovalModalType;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public modalData: { type: ApprovalModalType },
    private readonly dialogRef: MatDialogRef<ApprovalDecisionModalComponent>,
    private readonly formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      comment: [
        '',
        [Validators.required, Validators.maxLength(this.INPUT_MAX_LENGTH)],
      ],
    });
  }

  submitDialog(): void {
    if (this.formGroup.valid) {
      this.dialogRef.close({ comment: this.formGroup.controls.comment.value });
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
