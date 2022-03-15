import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AgGridModule } from '@ag-grid-community/angular';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CustomLoadingOverlayComponent } from '../table/custom-overlay/custom-loading-overlay/custom-loading-overlay.component';
import { CustomNoRowsOverlayComponent } from '../table/custom-overlay/custom-no-rows-overlay/custom-no-rows-overlay.component';
import {
  CalculationsStatusBarComponent,
  CalculationsStatusBarModule,
} from '../table/status-bar/calculations-status-bar';
import { CalculationsTableComponent } from './calculations-table.component';

@NgModule({
  declarations: [CalculationsTableComponent],
  imports: [
    CommonModule,
    CalculationsStatusBarModule,
    SharedTranslocoModule,
    AgGridModule.withComponents([
      CalculationsStatusBarComponent,
      CustomLoadingOverlayComponent,
      CustomNoRowsOverlayComponent,
    ]),
  ],
  exports: [CalculationsTableComponent],
})
export class CalculationsTableModule {}
