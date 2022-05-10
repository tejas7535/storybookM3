import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { AgGridModule } from '@ag-grid-community/angular';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CustomLoadingOverlayComponent } from '../table/custom-overlay/custom-loading-overlay/custom-loading-overlay.component';
import { CustomNoRowsOverlayComponent } from '../table/custom-overlay/custom-no-rows-overlay/custom-no-rows-overlay.component';
import { CostElementsStatusBarComponent } from '../table/status-bar/cost-elements-status-bar/cost-elements-status-bar.component';
import { CostElementsStatusBarModule } from '../table/status-bar/cost-elements-status-bar/cost-elements-status-bar.module';
import { CostElementsTableComponent } from './cost-elements-table.component';

@NgModule({
  declarations: [CostElementsTableComponent],
  imports: [
    CommonModule,
    AgGridModule.withComponents([
      CustomLoadingOverlayComponent,
      CustomNoRowsOverlayComponent,
      CostElementsStatusBarComponent,
    ]),
    MatIconModule,
    SharedTranslocoModule,
    CostElementsStatusBarModule,
  ],
  exports: [CostElementsTableComponent],
})
export class CostElementsTableModule {}
