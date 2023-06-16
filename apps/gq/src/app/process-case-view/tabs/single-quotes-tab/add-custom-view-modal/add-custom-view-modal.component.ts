import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';

@Component({
  selector: 'gq-add-view-modal',
  templateUrl: './add-custom-view-modal.component.html',
})
export class AddCustomViewModalComponent implements OnInit, AfterViewInit {
  NAME_MAX_LENGTH = 30;

  formGroup: FormGroup;

  @ViewChild('nameInput', { static: false, read: ElementRef })
  nameInput: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public modalData: {
      createNewView: boolean;
      showRadioButtons: boolean;
      name?: string;
    },
    private readonly dialogRef: MatDialogRef<AddCustomViewModalComponent>,
    private readonly formBuilder: FormBuilder,
    private readonly cdr: ChangeDetectorRef
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
