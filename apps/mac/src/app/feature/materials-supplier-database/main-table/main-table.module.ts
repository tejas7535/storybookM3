import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { PushModule } from '@ngrx/component';
import { AgGridModule } from 'ag-grid-angular';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { InputDialogModule } from '@mac/msd/main-table/input-dialog/input-dialog.module';
import { MsdDialogService } from '@mac/msd/services';

import { EditCellRendererComponent } from './edit-cell-renderer/edit-cell-renderer.component';
import { HeaderTooltipComponent } from './header-tooltip/header-tooltip.component';
import { MainTableComponent } from './main-table.component';
import { MainTableRoutingModule } from './main-table-routing.module';
import { MaterialDialogsModule } from './material-input-dialog/materials/materials.module';
import { QuickFilterComponent } from './quick-filter/quick-filter.component';

@NgModule({
  declarations: [
    MainTableComponent,
    EditCellRendererComponent,
    HeaderTooltipComponent,
  ],
  imports: [
    CommonModule,
    MainTableRoutingModule,
    AgGridModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    PushModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatIconModule,
    SharedTranslocoModule,
    InputDialogModule,
    QuickFilterComponent,
    MatDialogModule,
    MaterialDialogsModule,
  ],
  providers: [DatePipe, MsdDialogService],
})
export class MainTableModule {}
