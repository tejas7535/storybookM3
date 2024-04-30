import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import {
  MAT_MOMENT_DATE_FORMATS,
  MatMomentDateModule,
} from '@angular/material-moment-adapter';

import { PushPipe } from '@ngrx/component';

import { FileUploadComponent } from '@schaeffler/file-upload';
import { SelectModule } from '@schaeffler/inputs/select';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BaseDialogModule } from '@mac/msd/main-table/material-input-dialog/base-dialog/base-dialog.module';

import { MaturityInfoComponent } from '../../../maturity-info/maturity-info.component';
import { SapMaterialsUploadDialogComponent } from './sap-materials-upload-dialog.component';
import { ExcelValidatorService } from './sap-materials-upload-dialog-validation/excel-validation/excel-validator.service';
import { SapMaterialsUploadDragAndDropDirective } from './sap-materials-upload-drag-and-drop/sap-materials-upload-drag-and-drop.directive';
import { SapMaterialsUploadStatusChipComponent } from './sap-materials-upload-status-chip/sap-materials-upload-status-chip.component';
import { SapMaterialsUploadStatusDialogComponent } from './sap-materials-upload-status-dialog/sap-materials-upload-status-dialog.component';

const DATE_FORMATS = {
  parse: { dateInput: 'YYYY-MM-DD' },
  display: {
    ...MAT_MOMENT_DATE_FORMATS.display,
    dateInput: 'YYYY-MM-DD',
  },
};
@NgModule({
  declarations: [
    SapMaterialsUploadDialogComponent,
    SapMaterialsUploadStatusDialogComponent,
    SapMaterialsUploadDragAndDropDirective,
    SapMaterialsUploadStatusChipComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    SharedTranslocoModule,
    BaseDialogModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatRadioModule,
    MatChipsModule,
    LoadingSpinnerModule,
    MaturityInfoComponent,
    SelectModule,
    PushPipe,
    FileUploadComponent,
  ],
  exports: [
    SapMaterialsUploadDialogComponent,
    SapMaterialsUploadStatusDialogComponent,
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS },
    ExcelValidatorService,
  ],
})
export class SapMaterialsUploadDialogModule {}
