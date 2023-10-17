import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

import { take } from 'rxjs';

import moment, { Moment } from 'moment';

import { SapMaterialsUpload } from '@mac/feature/materials-supplier-database/models';
import { MsdDataService } from '@mac/feature/materials-supplier-database/services';

interface SapMaterialUploadDialogFormControl {
  owner: FormControl<string>;
  date: FormControl<Moment>;
  maturity: FormControl<number>;
  file: FormControl<File>;
}

@Component({
  selector: 'mac-sap-materials-upload-dialog',
  templateUrl: './sap-materials-upload-dialog.component.html',
})
export class SapMaterialsUploadDialogComponent implements OnInit {
  @ViewChild('fileChooser') fileChooserRef: ElementRef<HTMLInputElement>;

  possibleMaturity = [10, 8, 7, 5, 2];
  formGroup: FormGroup<SapMaterialUploadDialogFormControl>;
  isLoading = false;

  constructor(
    private readonly dialogRef: MatDialogRef<SapMaterialsUploadDialogComponent>,
    private readonly formBuilder: FormBuilder,
    private readonly dataService: MsdDataService
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group<SapMaterialUploadDialogFormControl>(
      {
        owner: new FormControl(
          undefined,
          Validators.compose([
            Validators.required,
            Validators.pattern('\\w{2,},\\s\\w{2,}\\s{1,2}\\w{2}/\\w+(-.+)?'),
          ])
        ),
        date: new FormControl(moment(), Validators.required),
        maturity: new FormControl(
          this.possibleMaturity[0],
          Validators.required
        ),
        file: new FormControl(undefined, Validators.required),
      }
    );
  }

  downloadDataTemplate(): void {
    window.open('/assets/templates/matnr_upload_template.xlsx', '_blank');
  }

  openFileChooser(): void {
    this.fileChooserRef?.nativeElement.click();
  }

  setFile(): void {
    this.formGroup.controls.file.setValue(
      this.fileChooserRef.nativeElement.files[0]
    );
  }

  upload(): void {
    this.isLoading = true;
    this.dataService
      .uploadSapMaterials(this.formGroup.value as SapMaterialsUpload)
      .pipe(take(1))
      .subscribe(() => this.close())
      .add(() => (this.isLoading = false));
  }

  close(): void {
    this.dialogRef.close();
  }
}
