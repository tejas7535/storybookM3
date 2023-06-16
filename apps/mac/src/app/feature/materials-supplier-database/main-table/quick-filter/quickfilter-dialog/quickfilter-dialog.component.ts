import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogModule as MatDialogModule,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';

import { PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'mac-quickfilter-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatRadioModule,
    PushPipe,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    SharedTranslocoModule,
  ],
  templateUrl: './quickfilter-dialog.component.html',
})
export class QuickfilterDialogComponent implements OnInit {
  // set quickfilter title
  public titleControl = new FormControl<string>(undefined, [
    Validators.required,
  ]);
  // decide between fromCurrent or fromDefault
  public radioControl = new FormControl<string>('true', [Validators.required]);
  // form group
  public formGroup: FormGroup<{
    title: FormControl<string>;
    fromCurrent: FormControl<string>;
  }>;
  public add = false;
  public edit = false;
  public delete = false;

  constructor(
    public dialogRef: MatDialogRef<QuickfilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; edit: boolean; delete: boolean }
  ) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      title: this.titleControl,
      fromCurrent: this.radioControl,
    });

    this.titleControl.setValue(this.data.title);
    this.radioControl.setValue('true');
    if (this.data.delete) {
      this.delete = true;
      this.radioControl.disable();
    } else if (this.data.edit) {
      this.edit = true;
      this.radioControl.disable();
    } else {
      this.add = true;
    }
  }

  // on cancel dialog
  closeDialog(): void {
    this.dialogRef.close();
  }

  // on apply / save dialog
  applyDialog(): void {
    const result = {
      ...this.formGroup.value,
      edit: this.edit,
      delete: this.delete,
    };
    this.dialogRef.close(result);
  }

  public onSubmit() {
    if (this.formGroup.valid) {
      this.applyDialog();
    }
  }
}
