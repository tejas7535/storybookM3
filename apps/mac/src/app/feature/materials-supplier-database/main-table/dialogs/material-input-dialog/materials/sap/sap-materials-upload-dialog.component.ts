/* eslint-disable max-lines */
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import {
  MAT_MOMENT_DATE_FORMATS,
  MatMomentDateModule,
  provideMomentDateAdapter,
} from '@angular/material-moment-adapter';

import { combineLatest, filter, Subject, take, takeUntil } from 'rxjs';

import { translate } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';
import {
  ColumnApi,
  ColumnState,
  ExcelCell,
  ExcelRow,
  GridApi,
} from 'ag-grid-community';
import moment, { Moment } from 'moment';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { FileUploadComponent, SelectedFile } from '@schaeffler/file-upload';
import { StringOption } from '@schaeffler/inputs';
import { SelectModule } from '@schaeffler/inputs/select';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MaterialClass } from '@mac/feature/materials-supplier-database/constants';
import { MaturityInfoComponent } from '@mac/feature/materials-supplier-database/main-table/components/maturity-info/maturity-info.component';
import { MsdAgGridReadyService } from '@mac/feature/materials-supplier-database/services';
import { DataFacade } from '@mac/feature/materials-supplier-database/store/facades/data';
import { DialogFacade } from '@mac/feature/materials-supplier-database/store/facades/dialog';

import { BaseDialogComponent } from '../../base-dialog/base-dialog.component';
import * as util from '../../util';
import { ExcelValidatorService } from './sap-materials-upload-dialog-validation/excel-validation/excel-validator.service';
import {
  COLUMN_HEADER_FIELDS,
  MANDATORY_COLUMNS,
} from './sap-materials-upload-dialog-validation/excel-validation/excel-validator-config';
import {
  sapMaterialsUploadDataOwnerValidator,
  sapMaterialsUploadFileValidator,
} from './sap-materials-upload-dialog-validation/sap-materials-upload-dialog-validator/sap-materials-upload-dialog.validator';
import { SapMaterialsUploadStatus } from './sap-materials-upload-status.enum';

interface SapMaterialUploadDialogFormControl {
  owner: FormControl<StringOption>;
  date: FormControl<Moment>;
  maturity: FormControl<number>;
  file: FormControl<File>;
  disclaimerAccepted: FormControl<boolean>;
}

const DATE_FORMATS = {
  parse: { dateInput: 'YYYY-MM-DD' },
  display: {
    ...MAT_MOMENT_DATE_FORMATS.display,
    dateInput: 'YYYY-MM-DD',
  },
};

@Component({
  selector: 'mac-sap-materials-upload-dialog',
  templateUrl: './sap-materials-upload-dialog.component.html',
  styleUrls: ['./sap-materials-upload-dialog.component.scss'],
  standalone: true,
  imports: [
    // default
    CommonModule,
    // msd
    BaseDialogComponent,
    MaturityInfoComponent,
    // angular material
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatChipsModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatRadioModule,
    // forms
    ReactiveFormsModule,
    // libs
    FileUploadComponent,
    LoadingSpinnerModule,
    SelectModule,
    SharedTranslocoModule,
    // ngrx
    PushPipe,
  ],
  providers: [ExcelValidatorService, provideMomentDateAdapter(DATE_FORMATS)],
})
export class SapMaterialsUploadDialogComponent implements OnInit, OnDestroy {
  possibleMaturity = [10, 9, 8, 7, 6, 5, 2];
  formGroup: FormGroup<SapMaterialUploadDialogFormControl>;
  uploadStatus: SapMaterialsUploadStatus;
  uploadButtonLabel: string;
  errorMessage: string;
  dataOwners$ = this.dialogFacade.sapMaterialsDataOwners$;
  fileControl: FormControl<File>;

  private agGridApi: GridApi;
  private columnApi: ColumnApi;
  private readonly destroy$ = new Subject<void>();

  private currentFile: SelectedFile;

  constructor(
    private readonly applicationInsightsService: ApplicationInsightsService,
    private readonly dialogRef: MatDialogRef<SapMaterialsUploadDialogComponent>,
    private readonly formBuilder: FormBuilder,
    private readonly dialogFacade: DialogFacade,
    private readonly dataFacade: DataFacade,
    private readonly excelValidatorService: ExcelValidatorService,
    private readonly agGridService: MsdAgGridReadyService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.dialogFacade.sapMaterialsUploadDialogOpened();
    this.applicationInsightsService.logEvent('[MAC - MSD] uploadDialogOpened', {
      materialClass: MaterialClass.SAP_MATERIAL,
    });

    this.initFormGroup();
    this.setDefaultOwner();
    this.handleFileUploadProgressChanges();
    this.handleUploadSucceeded();
    this.agGridService.agGridApi$
      .pipe(takeUntil(this.destroy$), filter(Boolean))
      .subscribe(({ gridApi, columnApi }) => {
        this.agGridApi = gridApi;
        this.columnApi = columnApi;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ownerFilterFnFactory = (option?: StringOption, value?: string) =>
    util.filterFn(option, value);

  addNewOwner(dataOwner: string): void {
    this.dialogFacade.addCustomDataOwner(dataOwner);
  }

  downloadDataTemplate(): void {
    this.applicationInsightsService.logEvent(
      '[MAC - MSD] uploadDialogTemplateDownload',
      { materialClass: MaterialClass.SAP_MATERIAL }
    );

    // get list of visible columns in the order they are displayed
    const visibleColumns = this.columnApi
      .getColumnState()
      .filter((columnState: ColumnState) => !columnState.hide)
      .map((columnState: ColumnState) => columnState.colId);

    // remove all columns that are not intended for upload
    const columns = visibleColumns.filter((columnName) =>
      COLUMN_HEADER_FIELDS.includes(columnName)
    );
    // find mandatory columns that are not displayed
    const missingMandatory = MANDATORY_COLUMNS.filter(
      (column) => !columns.includes(column)
    );
    // get list of optional columns that are not displayed
    const missingOptional = COLUMN_HEADER_FIELDS.filter(
      (column) => !MANDATORY_COLUMNS.includes(column)
    ).filter((column) => !columns.includes(column));
    // add missing columns to the end of the list
    columns.push(...missingMandatory, ...missingOptional);

    // prepare hint row - mandatory columns have a special prefix
    const mandatoryPrefix = translate(
      `materialsSupplierDatabase.mainTable.tooltip.mandatory`
    );

    const cells = columns
      .map((column) => {
        // prefix hintText with mandatory if necessary
        const mand = MANDATORY_COLUMNS.includes(column)
          ? mandatoryPrefix
          : undefined;
        // translate tooltip text
        let tooltip = this.agGridApi.getColumnDef(column)?.headerTooltip;
        tooltip = tooltip
          ? translate(`materialsSupplierDatabase.mainTable.tooltip.${tooltip}`)
          : undefined;
        // combine prefix and tooltip
        if (mand && tooltip) {
          return `${mand} - ${tooltip}`;
        }

        return mand || tooltip;
      })
      // transform text to ExcelCell Objects
      .map(
        (value) =>
          ({
            data: { type: 'String', value },
            styleId: 'hint',
          }) as ExcelCell
      );
    const hintRow = [{ cells } as ExcelRow];

    this.agGridApi.exportDataAsExcel({
      author: translate(
        'materialsSupplierDatabase.mainTable.excelExport.author'
      ),
      fileName: 'matnr_upload_template.xlsx',
      sheetName: 'template',
      columnKeys: columns,
      appendContent: hintRow,
      shouldRowBeSkipped: () => true,
    });
  }

  setFile(files: SelectedFile[]): void {
    if (files.length !== 1) {
      this.currentFile = undefined;
      this.fileControl.reset();

      return;
    }
    this.currentFile = files[0];
    this.fileControl.setValue(files[0].file);
    this.fileControl.markAsTouched();
    this.changeDetectorRef.detectChanges();
  }

  upload(): void {
    const { owner, date, maturity, file } = this.formGroup.value;
    const upload = { owner: owner.title, date, maturity, file };

    this.applicationInsightsService.logEvent(
      '[MAC - MSD] uploadDialogUploadStart',
      { materialClass: MaterialClass.SAP_MATERIAL, size: file.size }
    );
    this.dialogFacade.uploadSapMaterials(upload);
  }

  close(openStatusDialog?: boolean): void {
    this.dialogFacade.materialDialogCanceled();
    this.dialogRef.close({ openStatusDialog });
  }

  private getErrorMessage(errors: { [key: string]: any }): string {
    if (!errors) {
      return undefined;
    }
    if (errors.required) {
      return this.getTranslatedError('required');
    }
    if (errors.missingColumn) {
      return this.getTranslatedError('missingColumn', errors.params);
    }
    if (errors.missingValue) {
      return this.getTranslatedError('missingValue', errors.params);
    }
    if (errors.invalidValue) {
      return this.getTranslatedError('invalidValue', errors.params);
    }
    if (errors.invalidPcfValue) {
      return this.getTranslatedError('invalidPcfValue', errors.params);
    }
    if (errors.duplicatePrimaryKey) {
      return this.getTranslatedError('duplicatePrimaryKey', errors.params);
    }
    if (errors.missingPcfValue) {
      return this.getTranslatedError('missingPcfValue', errors.params);
    }
    if (errors.errorCell) {
      return this.getTranslatedError('errorCell', errors.params);
    }
    if (errors.invalidPcfSupplierEmissions) {
      return this.getTranslatedError(
        'invalidPcfSupplierEmissions',
        errors.params
      );
    }
    if (errors.unsupportedFileFormat) {
      return this.getTranslatedError('unsupportedFileFormat', errors.params);
    }

    return this.getTranslatedError('generic');
  }

  private getTranslatedError(key: string, params = {}): string {
    return translate(
      `materialsSupplierDatabase.mainTable.uploadDialog.error.${key}`,
      params
    );
  }

  private initFormGroup(): void {
    this.fileControl = new FormControl(
      undefined,
      [Validators.required, sapMaterialsUploadFileValidator().bind(this)],
      this.excelValidatorService.validate.bind(this.excelValidatorService)
    );

    this.fileControl.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.uploadStatus = this.determineUploadStatus();
        this.errorMessage = this.getErrorMessage(this.fileControl.errors);
        if (this.errorMessage && this.currentFile) {
          this.currentFile.setMessage({
            type: 'error',
            title: 'Validation failed!',
            description: this.errorMessage,
          });
        }
      });

    this.formGroup = this.formBuilder.group<SapMaterialUploadDialogFormControl>(
      {
        owner: new FormControl(undefined, [
          Validators.required,
          sapMaterialsUploadDataOwnerValidator().bind(this),
        ]),
        date: new FormControl(moment(), Validators.required),
        maturity: new FormControl(undefined, Validators.required),
        file: this.fileControl,
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

  private handleFileUploadProgressChanges(): void {
    this.dialogFacade.sapMaterialsFileUploadProgress$
      .pipe(takeUntil(this.destroy$))
      .subscribe((progress: number) => {
        const progressText = progress ? `${progress}%` : '';
        this.uploadButtonLabel = `${translate(
          'materialsSupplierDatabase.mainTable.uploadDialog.upload'
        )} ${progressText}`.trim();
      });
  }

  private handleUploadSucceeded(): void {
    this.dialogFacade.uploadSapMaterialsSucceeded$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.close(true);
      });
  }

  private determineUploadStatus(): SapMaterialsUploadStatus {
    if (!this.fileControl.value) {
      return undefined;
    }

    switch (this.fileControl.status) {
      case 'PENDING': {
        return SapMaterialsUploadStatus.IN_PROGRESS;
      }
      case 'VALID': {
        return SapMaterialsUploadStatus.SUCCEEDED;
      }
      default: {
        return SapMaterialsUploadStatus.FAILED;
      }
    }
  }
}
