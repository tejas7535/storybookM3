import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { AgGridModule } from 'ag-grid-angular';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MaterialNumberModule } from '@cdba/shared/pipes';

import { CostElementsStatusBarModule } from '../table/status-bar/cost-elements-status-bar';
import { CostElementsTableComponent } from './cost-elements-table.component';

@NgModule({
  declarations: [CostElementsTableComponent],
  imports: [
    CommonModule,
    AgGridModule,
    MatIconModule,
    SharedTranslocoModule,
    CostElementsStatusBarModule,
    MaterialNumberModule,
  ],
  exports: [CostElementsTableComponent],
})
export class CostElementsTableModule {}
