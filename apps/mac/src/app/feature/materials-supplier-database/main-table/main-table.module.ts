import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { PushModule } from '@ngrx/component';
import { AgGridModule } from 'ag-grid-angular';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { InputDialogModule } from '@mac/msd/main-table/input-dialog/input-dialog.module';

import { EditCellRendererComponent } from './edit-cell-renderer/edit-cell-renderer.component';
import { MainTableComponent } from './main-table.component';
import { MainTableRoutingModule } from './main-table-routing.module';
import { QuickFilterComponent } from './quick-filter/quick-filter.component';

@NgModule({
  declarations: [MainTableComponent, EditCellRendererComponent],
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
  ],
  providers: [DatePipe],
})
export class MainTableModule {}
