import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { ApprovalLevel } from '@gq/shared/models/quotation/approval-level.enum';
import { Approver } from '@gq/shared/models/quotation/approver.model';

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

  approver1FormControl = new FormControl('', Validators.required);
  approver2FormControl = new FormControl('', Validators.required);
  approver3FormControl = new FormControl(
    '',
    this.approver3Required ? Validators.required : undefined
  );
  approverCCFormControl = new FormControl('');

  // Mock Data - to be deleted once we get the real data from BE
  approversLevel1: Approver[] = [
    {
      userId: 'schmjan',
      firstName: 'Schmitt',
      lastName: 'Jan',
      approvalLevel: ApprovalLevel.L1,
    },
    {
      userId: 'johndoe',
      firstName: 'John',
      lastName: 'Doe',
      approvalLevel: ApprovalLevel.L1,
    },
  ];

  approversLevel2: Approver[] = [
    {
      userId: 'kloedlrp',
      firstName: 'Ralph',
      lastName: 'Kloeditz',
      approvalLevel: ApprovalLevel.L1,
    },
    {
      userId: 'foobar',
      firstName: 'Foo',
      lastName: 'Bar',
      approvalLevel: ApprovalLevel.L1,
    },
  ];

  approversCC: Approver[] = [
    {
      userId: 'schmjan',
      firstName: 'Schmitt',
      lastName: 'Jan',
      approvalLevel: ApprovalLevel.L1,
    },
    {
      userId: 'kloedlrp',
      firstName: 'Ralph',
      lastName: 'Kloeditz',
      approvalLevel: ApprovalLevel.L1,
    },
    {
      userId: 'foobar',
      firstName: 'Foo',
      lastName: 'Bar',
      approvalLevel: ApprovalLevel.L1,
    },
    {
      userId: 'johndoe',
      firstName: 'John',
      lastName: 'Doe',
      approvalLevel: ApprovalLevel.L1,
    },
  ];

  constructor(
    private readonly dialogRef: MatDialogRef<ReleaseModalComponent>,
    private readonly formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      approver1: this.approver1FormControl,
      approver2: this.approver2FormControl,
      approver3: this.approver3FormControl,
      approverCC: this.approverCCFormControl,
      comment: ['', Validators.maxLength(this.INPUT_MAX_LENGTH)],
      projectInformation: ['', Validators.maxLength(this.INPUT_MAX_LENGTH)],
    });
    this.autoApprovalEnabled = this.approvalLevel === ApprovalLevel.NONE;
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
