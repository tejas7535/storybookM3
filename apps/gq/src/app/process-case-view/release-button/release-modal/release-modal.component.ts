import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'gq-release-modal',
  templateUrl: './release-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReleaseModalComponent implements OnInit {
  formGroup: FormGroup;

  INPUT_MAX_LENGTH = 200;

  constructor(
    private readonly dialogRef: MatDialogRef<ReleaseModalComponent>,
    private readonly formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      comment: ['', Validators.maxLength(this.INPUT_MAX_LENGTH)],
      projectInformation: ['', Validators.maxLength(this.INPUT_MAX_LENGTH)],
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
