import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { getAvailableCurrencies } from '../../../../core/store';

@Component({
  selector: 'gq-edit-case-modal',
  templateUrl: './edit-case-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditCaseModalComponent implements OnInit {
  NAME_MAX_LENGTH = 20;

  public caseModalForm: UntypedFormGroup;

  currencies$: Observable<string[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public modalData: {
      caseName: string;
      currency: string;
    },
    private readonly dialogRef: MatDialogRef<EditCaseModalComponent>,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.currencies$ = this.store.select(getAvailableCurrencies);

    this.caseModalForm = new UntypedFormGroup({
      caseName: new UntypedFormControl(this.modalData?.caseName || '', [
        Validators.pattern('\\s*\\S.*'),
        Validators.maxLength(this.NAME_MAX_LENGTH),
      ]),
      currency: new UntypedFormControl(this.modalData.currency, [
        Validators.required,
      ]),
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  submitDialog(): void {
    this.dialogRef.close({
      caseName: this.caseModalForm.controls.caseName.value.trim(),
      currency: this.caseModalForm.controls.currency.value,
    });
  }
}
