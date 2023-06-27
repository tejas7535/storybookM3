import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
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

import { LetModule, PushPipe } from '@ngrx/component';

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
