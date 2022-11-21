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

import { PushModule } from '@ngrx/component';

import { SelectModule } from '@schaeffler/inputs/select';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { Co2ComponentComponent } from './components/co2-component/co2-component.component';
import { ManufacturerSupplierComponent } from './components/manufacturer-supplier/manufacturer-supplier.component';
import { MaterialDialogBasePartDirective } from './components/material-dialog-base-part/material-dialog-base-part.directive';
import { MaterialStandardComponent } from './components/material-standard/material-standard.component';
import { MaterialInputDialogComponent as MaterialInputDialogComponent } from './material-input-dialog.component';
import { DialogControlsService } from './services';

@NgModule({
  declarations: [
    MaterialInputDialogComponent,
    MaterialStandardComponent,
    ManufacturerSupplierComponent,
    Co2ComponentComponent,
    MaterialDialogBasePartDirective,
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    PushModule,
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
  ],
  exports: [
    MaterialInputDialogComponent,
    MaterialStandardComponent,
    ManufacturerSupplierComponent,
    Co2ComponentComponent,
    MaterialDialogBasePartDirective,
  ],
  providers: [DialogControlsService],
})
export class MaterialInputDialogModule {}
