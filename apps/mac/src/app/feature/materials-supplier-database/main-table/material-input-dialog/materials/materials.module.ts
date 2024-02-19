import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { LetDirective, PushPipe } from '@ngrx/component';

import { SelectModule } from '@schaeffler/inputs/select';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BaseDialogModule } from '@mac/msd/main-table/material-input-dialog/base-dialog/base-dialog.module';
import { MaterialInputDialogModule } from '@mac/msd/main-table/material-input-dialog/material-input-dialog.module';
import { DialogControlsService } from '@mac/msd/main-table/material-input-dialog/services';

import { ManufacturerSupplierInputDialogComponent } from '../manufacturer-supplier/manufacturersupplier-input-dialog.component';
import { MaterialStandardInputDialogComponent } from '../material-standard/material-standard-input-dialog.component';
import { AluminumInputDialogComponent } from './aluminum/aluminum-input-dialog.component';
import { CeramicInputDialogComponent } from './ceramic/ceramic-input-dialog.component';
import { CopperInputDialogComponent } from './copper/copper-input-dialog.component';
import { SapMaterialsUploadDialogModule } from './sap/sap-materials-upload-dialog.module';
import { ReferenceDocumentBulkEditDialogComponent } from './steel/reference-document-bulk-edit-dialog/reference-document-bulk-edit-dialog.component';
import { SteelInputDialogComponent } from './steel/steel-input-dialog.component';

@NgModule({
  declarations: [
    MaterialStandardInputDialogComponent,
    ManufacturerSupplierInputDialogComponent,
    AluminumInputDialogComponent,
    SteelInputDialogComponent,
    CopperInputDialogComponent,
    CeramicInputDialogComponent,
    ReferenceDocumentBulkEditDialogComponent,
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    PushPipe,
    LetDirective,
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
  ],
  exports: [
    MaterialStandardInputDialogComponent,
    ManufacturerSupplierInputDialogComponent,
    AluminumInputDialogComponent,
    SteelInputDialogComponent,
    CopperInputDialogComponent,
    CeramicInputDialogComponent,
    SapMaterialsUploadDialogModule,
  ],
  providers: [DialogControlsService],
})
export class MaterialDialogsModule {}
