import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

import { combineLatest, filter, take } from 'rxjs';

import moment, { Moment } from 'moment';

import { StringOption } from '@schaeffler/inputs';

import { MsdDataService } from '@mac/feature/materials-supplier-database/services';
import {
  addCustomDataOwner,
  materialDialogCanceled,
  sapMaterialsUploadDialogOpened,
} from '@mac/feature/materials-supplier-database/store/actions/dialog';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';
import { DialogFacade } from '@mac/feature/materials-supplier-database/store/facades/dialog';

import * as util from '../../util';
import {
  sapMaterialsUploadDataOwnerValidator,
  sapMaterialsUploadFileValidator,
} from './sap-materials-upload-dialog.validator';
import { SapMaterialsUploadStatus } from './sap-materials-upload-status-chip/sap-materials-upload-status.enum';

interface SapMaterialUploadDialogFormControl {
  owner: FormControl<StringOption>;
  date: FormControl<Moment>;
  maturity: FormControl<number>;
  file: FormControl<File>;
  disclaimerAccepted: FormControl<boolean>;
}

@Component({
  selector: 'mac-sap-materials-upload-dialog',
  templateUrl: './sap-materials-upload-dialog.component.html',
  styleUrls: ['./sap-materials-upload-dialog.component.scss'],
})
export class SapMaterialsUploadDialogComponent implements OnInit {
  @ViewChild('fileChooser') fileChooserRef: ElementRef;

  possibleMaturity = [10, 8, 7, 5, 2];
  formGroup: FormGroup<SapMaterialUploadDialogFormControl>;
  isLoading = false;
  uploadStatus: SapMaterialsUploadStatus;
  dataOwners$ = this.dialogFacade.sapMaterialsDataOwners$;

  constructor(
    private readonly dialogRef: MatDialogRef<SapMaterialsUploadDialogComponent>,
    private readonly formBuilder: FormBuilder,
    private readonly dataService: MsdDataService,
    private readonly dialogFacade: DialogFacade,
    private readonly dataFacade: DataFacade
  ) {}

  ngOnInit(): void {
    this.dialogFacade.dispatch(sapMaterialsUploadDialogOpened());

    this.initFormGroup();
    this.setDefaultOwner();
  }

  ownerFilterFnFactory = (option?: StringOption, value?: string) =>
    util.filterFn(option, value);

  addNewOwner(dataOwner: string): void {
    this.dialogFacade.dispatch(addCustomDataOwner({ dataOwner }));
  }

  downloadDataTemplate(): void {
    window.open('/assets/templates/matnr_upload_template.xlsx', '_blank');
  }

  openFileChooser(): void {
    this.fileChooserRef?.nativeElement.click();
  }

  setFile(file: File): void {
    this.formGroup.controls.file.setValue(file);
    this.uploadStatus = this.determineUploadStatus();

    if (!file) {
      // Reset the input element value.
      // Needed because the change event is not triggered if the same file is removed and selected again.
      this.fileChooserRef.nativeElement.value = '';
    }
  }

  upload(): void {
    this.isLoading = true;
    const { owner, date, maturity, file } = this.formGroup.value;
    this.dataService
      .uploadSapMaterials({ owner: owner.title, date, maturity, file })
      .pipe(take(1))
      .subscribe(() => this.close())
      .add(() => (this.isLoading = false));
  }

  close(): void {
    this.dialogFacade.dispatch(materialDialogCanceled());
    this.dialogRef.close();
  }

  private initFormGroup(): void {
    this.formGroup = this.formBuilder.group<SapMaterialUploadDialogFormControl>(
      {
        owner: new FormControl(undefined, [
          Validators.required,
          sapMaterialsUploadDataOwnerValidator().bind(this),
        ]),
        date: new FormControl(moment(), Validators.required),
        maturity: new FormControl(
          this.possibleMaturity[0],
          Validators.required
        ),
        file: new FormControl(undefined, [
          Validators.required,
          sapMaterialsUploadFileValidator().bind(this),
        ]),
        disclaimerAccepted: new FormControl(false, Validators.requiredTrue),
      }
    );
  }

  /**
   * Set the current user as a data owner by default
   */
  private setDefaultOwner(): void {
    combineLatest([this.dataFacade.username$, this.dataOwners$])
      .pipe(
        filter(
          ([username, dataOwners]) => !!username && dataOwners?.length > 0
        ),
        take(1)
      )
      .subscribe(([username, dataOwners]) => {
        const dataOwnerUser = dataOwners.find(
          (dataOwner: StringOption) =>
            dataOwner.title.toLowerCase() === username.toLowerCase()
        );

        if (dataOwnerUser) {
          this.formGroup.get('owner').setValue(dataOwnerUser);
        }
      });
  }

  private determineUploadStatus(): SapMaterialsUploadStatus {
    if (!this.formGroup.get('file').value) {
      return undefined;
    }

    if (this.formGroup.get('file').valid) {
      return SapMaterialsUploadStatus.SUCCEED;
    }

    return SapMaterialsUploadStatus.FAILED;
  }
}
