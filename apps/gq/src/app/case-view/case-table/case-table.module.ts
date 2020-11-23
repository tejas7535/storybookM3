import { NgModule } from '@angular/core';

import { AgGridModule } from '@ag-grid-community/angular';

import { SharedModule } from '../../shared';
import { CaseTableComponent } from './case-table.component';

@NgModule({
  declarations: [CaseTableComponent],
  imports: [AgGridModule.withComponents({}), SharedModule],
  exports: [CaseTableComponent],
})
export class CaseTableModule {}
