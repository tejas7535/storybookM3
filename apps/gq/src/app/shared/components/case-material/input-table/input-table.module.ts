import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AgGridModule } from '@ag-grid-community/angular';

import { CellRendererModule } from '../../../cell-renderer/cell-renderer.module';
import { CustomStatusBarModule } from '../../../custom-status-bar/custom-status-bar.module';
import { InputTableComponent } from './input-table.component';

@NgModule({
  declarations: [InputTableComponent],
  imports: [
    AgGridModule.withComponents([]),
    CommonModule,
    CellRendererModule,
    CustomStatusBarModule,
  ],
  exports: [InputTableComponent],
})
export class InputTableModule {}
