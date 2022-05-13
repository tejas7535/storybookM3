import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { AgGridModule } from '@ag-grid-community/angular';
import { MaterialNumberModule } from '@cdba/shared/pipes';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CustomLoadingOverlayComponent } from '../table/custom-overlay/custom-loading-overlay/custom-loading-overlay.component';
import { CustomNoRowsOverlayComponent } from '../table/custom-overlay/custom-no-rows-overlay/custom-no-rows-overlay.component';
import { RawMaterialAnalysisTableComponent } from './raw-material-analysis-table.component';

@NgModule({
  declarations: [RawMaterialAnalysisTableComponent],
  imports: [
    CommonModule,
    MatIconModule,
    SharedTranslocoModule,
    AgGridModule.withComponents([
      CustomLoadingOverlayComponent,
      CustomNoRowsOverlayComponent,
    ]),
    MaterialNumberModule,
  ],
  exports: [RawMaterialAnalysisTableComponent],
})
export class RawMaterialAnalysisTableModule {}
