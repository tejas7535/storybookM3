import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatRadioModule } from '@angular/material/radio';
import {
  MAT_MOMENT_DATE_FORMATS,
  MatMomentDateModule,
} from '@angular/material-moment-adapter';

import { LetModule, PushPipe } from '@ngrx/component';

import { SelectModule } from '@schaeffler/inputs/select';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BaseDialogModule } from '@mac/msd/main-table/material-input-dialog/base-dialog/base-dialog.module';
import { MaterialInputDialogModule } from '@mac/msd/main-table/material-input-dialog/material-input-dialog.module';
import { DialogControlsService } from '@mac/msd/main-table/material-input-dialog/services';

import { ManufacturerSupplierInputDialogComponent } from '../manufacturer-supplier/manufacturersupplier-input-dialog.component';
import { MaterialStandardInputDialogComponent } from '../material-standard/material-standard-input-dialog.component';
import { AluminumInputDialogComponent } from './aluminum/aluminum-input-dialog.component';
import { CeramicInputDialogComponent } from './ceramic/ceramic-input-dialog.component';
import { CopperInputDialogComponent } from './copper/copper-input-dialog.component';
import { SapMaterialsUploadDialogComponent } from './sap/sap-materials-upload-dialog.component';
import { SteelInputDialogComponent } from './steel/steel-input-dialog.component';

const DATE_FORMATS = {
  parse: { dateInput: 'YYYY-MM-DD' },
  display: {
    ...MAT_MOMENT_DATE_FORMATS.display,
    dateInput: 'YYYY-MM-DD',
  },
};
@NgModule({
  declarations: [
    MaterialStandardInputDialogComponent,
    ManufacturerSupplierInputDialogComponent,
    AluminumInputDialogComponent,
    SteelInputDialogComponent,
    CopperInputDialogComponent,
    CeramicInputDialogComponent,
    SapMaterialsUploadDialogComponent,
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    PushPipe,
    LetModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatInputModule,
    MatCheckboxModule,
    MatFormFieldModule,
    SelectModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatGridListModule,
    MatSelectModule,
    MatTooltipModule,
    SharedTranslocoModule,
    MatSnackBarModule,
    BaseDialogModule,
    MaterialInputDialogModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatRadioModule,
    LoadingSpinnerModule,
  ],
  exports: [
    MaterialStandardInputDialogComponent,
    ManufacturerSupplierInputDialogComponent,
    AluminumInputDialogComponent,
    SteelInputDialogComponent,
    CopperInputDialogComponent,
    CeramicInputDialogComponent,
    SapMaterialsUploadDialogComponent,
  ],
  providers: [
    DialogControlsService,
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS },
  ],
})
export class MaterialDialogsModule {}
