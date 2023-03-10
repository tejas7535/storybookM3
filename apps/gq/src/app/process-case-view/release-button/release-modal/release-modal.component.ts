import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { ApprovalLevel } from '@gq/shared/models/quotation/approvalLevel.enum';
import { Approver } from '@gq/shared/models/quotation/approver';

@Component({
  selector: 'gq-release-modal',
  templateUrl: './release-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReleaseModalComponent implements OnInit {
  formGroup: FormGroup;

  INPUT_MAX_LENGTH = 200;

  approver1FormControl = new FormControl('', Validators.required);
  approver2FormControl = new FormControl('', Validators.required);
  approverCCFormControl = new FormControl('');

  // Mock Data - to be deleted once we get the real data from BE
  approversLevel1: Approver[] = [
    {
      id: 'schmjan',
      firstName: 'Schmitt',
      lastName: 'Jan',
      approvalLevel: ApprovalLevel.L1,
    },
    {
      id: 'johndoe',
      firstName: 'John',
      lastName: 'Doe',
      approvalLevel: ApprovalLevel.L1,
    },
  ];

  approversLevel2: Approver[] = [
    {
      id: 'kloedlrp',
      firstName: 'Ralph',
      lastName: 'Kloeditz',
      approvalLevel: ApprovalLevel.L1,
    },
    {
      id: 'foobar',
      firstName: 'Foo',
      lastName: 'Bar',
      approvalLevel: ApprovalLevel.L1,
    },
  ];

  approversCC: Approver[] = [
    {
      id: 'schmjan',
      firstName: 'Schmitt',
      lastName: 'Jan',
      approvalLevel: ApprovalLevel.L1,
    },
    {
      id: 'kloedlrp',
      firstName: 'Ralph',
      lastName: 'Kloeditz',
      approvalLevel: ApprovalLevel.L1,
    },
    {
      id: 'foobar',
      firstName: 'Foo',
      lastName: 'Bar',
      approvalLevel: ApprovalLevel.L1,
    },
    {
      id: 'johndoe',
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
      approverCC: this.approverCCFormControl,
      comment: ['', Validators.maxLength(this.INPUT_MAX_LENGTH)],
      projectInformation: ['', Validators.maxLength(this.INPUT_MAX_LENGTH)],
    });
  }

  startWorkflow() {
    console.log(
      'Start Workflow with approver1:',
      this.approver1FormControl.value,
      'approver2:',
      this.approver2FormControl.value,
      'approverCC:',
      this.approverCCFormControl.value,
      'comment:',
      this.formGroup.get('comment').value,
      'projectInformation:',
      this.formGroup.get('projectInformation').value
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
