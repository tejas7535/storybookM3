import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'gq-add-view-modal',
  templateUrl: './add-custom-view-modal.component.html',
})
export class AddCustomViewModalComponent implements OnInit {
  NAME_MAX_LENGTH = 30;

  formGroup: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public modalData: {
      createNewView: boolean;
      showRadioButtons: boolean;
      name?: string;
    },
    private readonly dialogRef: MatDialogRef<AddCustomViewModalComponent>,
    private readonly formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      name: new FormControl(this.modalData.name || '', [
        Validators.required,
        Validators.maxLength(this.NAME_MAX_LENGTH),
      ]),
    });

    if (this.modalData.createNewView) {
      this.formGroup.addControl('createFromDefault', new FormControl(true, []));
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.dialogRef.close({
      createNewView: this.modalData.createNewView,
      name: this.formGroup.controls['name'].value,
      createFromDefault: this.formGroup.controls['createFromDefault']?.value,
    });
  }
}
