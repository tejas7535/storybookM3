import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';

import { AgGridModule } from '@ag-grid-community/angular';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CustomLoadingOverlayComponent } from '../table/custom-overlay/custom-loading-overlay/custom-loading-overlay.component';
import { CustomNoRowsOverlayComponent } from '../table/custom-overlay/custom-no-rows-overlay/custom-no-rows-overlay.component';
import { RadioButtonCellRenderComponent } from '../table/radio-button-cell-render/radio-button-cell-render.component';
import {
  CalculationsStatusBarComponent,
  CalculationsStatusBarModule,
} from '../table/status-bar/calculations-status-bar';
import { CalculationsTableComponent } from './calculations-table.component';

@NgModule({
  declarations: [CalculationsTableComponent, RadioButtonCellRenderComponent],
  imports: [
    CommonModule,
    MatRadioModule,
    CalculationsStatusBarModule,
    SharedTranslocoModule,
    AgGridModule.withComponents([
      CalculationsStatusBarComponent,
      CustomLoadingOverlayComponent,
      CustomNoRowsOverlayComponent,
      RadioButtonCellRenderComponent,
    ]),
  ],
  exports: [CalculationsTableComponent],
})
export class CalculationsTableModule {}
