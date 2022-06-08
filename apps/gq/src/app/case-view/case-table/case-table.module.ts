import { NgModule } from '@angular/core';

import { AgGridModule } from '@ag-grid-community/angular';
import { PushModule } from '@ngrx/component';

import { CaseTableComponent } from './case-table.component';

@NgModule({
  declarations: [CaseTableComponent],
  imports: [AgGridModule.withComponents({}), PushModule],
  exports: [CaseTableComponent],
})
export class CaseTableModule {}
