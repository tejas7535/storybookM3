import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';

import { AgGridModule } from 'ag-grid-angular';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { RadioButtonCellRenderComponent } from '../table/radio-button-cell-render/radio-button-cell-render.component';
import { CalculationsStatusBarModule } from '../table/status-bar/calculations-status-bar';
import { CalculationsTableComponent } from './calculations-table.component';

@NgModule({
  declarations: [CalculationsTableComponent, RadioButtonCellRenderComponent],
  imports: [
    CommonModule,
    MatRadioModule,
    CalculationsStatusBarModule,
    SharedTranslocoModule,
    AgGridModule,
  ],
  exports: [CalculationsTableComponent],
})
export class CalculationsTableModule {}
