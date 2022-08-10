import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { AgGridModule } from 'ag-grid-angular';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MaterialNumberModule } from '@cdba/shared/pipes';

import { RawMaterialAnalysisTableComponent } from './raw-material-analysis-table.component';

@NgModule({
  declarations: [RawMaterialAnalysisTableComponent],
  imports: [
    CommonModule,
    MatIconModule,
    SharedTranslocoModule,
    AgGridModule,
    MaterialNumberModule,
  ],
  exports: [RawMaterialAnalysisTableComponent],
})
export class RawMaterialAnalysisTableModule {}
