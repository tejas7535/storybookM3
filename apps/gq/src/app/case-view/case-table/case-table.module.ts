import { NgModule } from '@angular/core';

import { PushModule } from '@ngrx/component';
import { AgGridModule } from 'ag-grid-angular';

import { CaseTableComponent } from './case-table.component';

@NgModule({
  declarations: [CaseTableComponent],
  imports: [AgGridModule, PushModule],
  exports: [CaseTableComponent],
})
export class CaseTableModule {}
