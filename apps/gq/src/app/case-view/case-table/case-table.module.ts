import { NgModule } from '@angular/core';

import { AgGridModule } from '@ag-grid-community/angular';

import { CaseTableComponent } from './case-table.component';

@NgModule({
  declarations: [CaseTableComponent],
  imports: [AgGridModule.withComponents({})],
  exports: [CaseTableComponent],
})
export class CaseTableModule {}
