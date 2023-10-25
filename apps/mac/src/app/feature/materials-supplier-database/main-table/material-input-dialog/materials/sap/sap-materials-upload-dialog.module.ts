import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatRadioModule } from '@angular/material/radio';
import {
  MAT_MOMENT_DATE_FORMATS,
  MatMomentDateModule,
} from '@angular/material-moment-adapter';

import { PushPipe } from '@ngrx/component';

import { SelectModule } from '@schaeffler/inputs/select';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BaseDialogModule } from '@mac/msd/main-table/material-input-dialog/base-dialog/base-dialog.module';

import { MaturityInfoComponent } from '../../../maturity-info/maturity-info.component';
import { SapMaterialsUploadDialogComponent } from './sap-materials-upload-dialog.component';
import { SapMaterialsUploadDragAndDropDirective } from './sap-materials-upload-drag-and-drop.directive';
import { SapMaterialsUploadStatusChipComponent } from './sap-materials-upload-status-chip/sap-materials-upload-status-chip.component';

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
  ],
  exports: [SapMaterialsUploadDialogComponent],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS }],
})
export class SapMaterialsUploadDialogModule {}
