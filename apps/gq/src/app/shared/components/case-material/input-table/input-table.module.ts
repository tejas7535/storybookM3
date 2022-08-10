import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PushModule } from '@ngrx/component';
import { AgGridModule } from 'ag-grid-angular';

import { CellRendererModule } from '../../../ag-grid/cell-renderer/cell-renderer.module';
import { CustomStatusBarModule } from '../../../ag-grid/custom-status-bar/custom-status-bar.module';
import { InputTableComponent } from './input-table.component';

@NgModule({
  declarations: [InputTableComponent],
  imports: [
    AgGridModule,
    CommonModule,
    CellRendererModule,
    CustomStatusBarModule,
    PushModule,
  ],
  exports: [InputTableComponent],
})
export class InputTableModule {}
