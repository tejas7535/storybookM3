import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { ApprovalFacade } from '@gq/core/store/approval/approval.facade';
import { ApprovalLevel } from '@gq/shared/models/quotation/approval-level.enum';
import { approverValidator } from '@gq/shared/validators/approver-validator';
import { TranslocoService } from '@ngneat/transloco';
@Component({
  selector: 'gq-release-modal',
  templateUrl: './release-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReleaseModalComponent implements OnInit {
  formGroup: FormGroup;

  INPUT_MAX_LENGTH = 1000;

  // ToDo: adjust once we get the data from BE
  approver3Required = true;
  approvalLevel: ApprovalLevel;

  autoApprovalEnabled: boolean;

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
    Validators.compose([
      approverValidator().bind(this),
      this.approver3Required ? Validators.required : undefined,
    ])
  );
  approverCCFormControl = new FormControl('');

  private readonly REQUIRED_ERROR_MESSAGE = '';
  private readonly INVALID_APPROVER_ERROR_MESSAGE = '';

  constructor(
    public readonly approvalFacade: ApprovalFacade,
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
    this.approvalFacade.getApprovers();

    this.formGroup = this.formBuilder.group({
      approver1: this.approver1FormControl,
      approver2: this.approver2FormControl,
      approver3: this.approver3FormControl,
      approverCC: this.approverCCFormControl,
      comment: ['', Validators.maxLength(this.INPUT_MAX_LENGTH)],
      projectInformation: ['', Validators.maxLength(this.INPUT_MAX_LENGTH)],
    });

    this.autoApprovalEnabled = this.approvalLevel === ApprovalLevel.L0;

    this.formGroup.get('approver1').updateValueAndValidity();
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
