import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AgGridModule } from 'ag-grid-angular';

import { MaterialNumberModule } from '@cdba/shared/pipes';

import { BomLegendComponent } from './bom-legend.component';
import { MaterialDesignationCellRendererComponent } from './material-designation-cell-renderer/material-designation-cell-renderer.component';

@NgModule({
  declarations: [BomLegendComponent, MaterialDesignationCellRendererComponent],
  imports: [CommonModule, AgGridModule, MaterialNumberModule],
  exports: [BomLegendComponent],
})
export class BomLegendModule {}
