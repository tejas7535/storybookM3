import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

import { PushModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'mac-quickfilter-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    PushModule,
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
  public edit = false;

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      title: this.titleControl,
      fromCurrent: this.radioControl,
    });
    if (this.data?.edit) {
      this.edit = true;
      this.titleControl.setValue(this.data.title);
      this.radioControl.setValue('true');
      this.radioControl.disable();
    }
  }

  constructor(
    public dialogRef: MatDialogRef<QuickfilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; edit: boolean }
  ) {}

  // on cancel dialog
  closeDialog(): void {
    this.dialogRef.close();
  }

  // on apply / save dialog
  applyDialog(): void {
    const result = { ...this.formGroup.value };
    this.dialogRef.close(result);
  }
}
