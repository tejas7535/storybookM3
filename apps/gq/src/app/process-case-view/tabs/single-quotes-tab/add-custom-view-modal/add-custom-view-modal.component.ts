import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'gq-add-view-modal',
  templateUrl: './add-custom-view-modal.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    DialogHeaderModule,
    SharedTranslocoModule,
  ],
})
export class AddCustomViewModalComponent implements OnInit, AfterViewInit {
  NAME_MAX_LENGTH = 30;

  formGroup: FormGroup;

  @ViewChild('nameInput', { static: false, read: ElementRef })
  nameInput: ElementRef;

  private readonly dialogRef = inject(
    MatDialogRef<AddCustomViewModalComponent>
  );
  private readonly formBuilder = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);

  public modalData = inject<{
    createNewView: boolean;
    showRadioButtons: boolean;
    name?: string;
  }>(MAT_DIALOG_DATA);

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

  ngAfterViewInit(): void {
    this.nameInput.nativeElement.focus();
    this.cdr.detectChanges();
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
