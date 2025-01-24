import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AgGridModule } from 'ag-grid-angular';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CalculationsStatusBarModule } from '../table/status-bar/calculations-status-bar';
import { CalculationsTableComponent } from './calculations-table.component';

@NgModule({
  declarations: [CalculationsTableComponent],
  imports: [
    CommonModule,
    CalculationsStatusBarModule,
    SharedTranslocoModule,
    AgGridModule,
  ],
  exports: [CalculationsTableComponent],
})
export class CalculationsTableModule {}
