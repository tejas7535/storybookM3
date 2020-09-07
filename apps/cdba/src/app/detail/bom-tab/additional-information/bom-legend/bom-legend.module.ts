import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AgGridModule } from '@ag-grid-community/angular';

import { BomLegendComponent } from './bom-legend.component';
import { MaterialDesignationCellRendererComponent } from './material-designation-cell-renderer/material-designation-cell-renderer.component';

@NgModule({
  declarations: [BomLegendComponent, MaterialDesignationCellRendererComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    AgGridModule.withComponents([MaterialDesignationCellRendererComponent]),
  ],
  exports: [BomLegendComponent],
})
export class BomLegendModule {}
