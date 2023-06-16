import { NgModule } from '@angular/core';

import { PushPipe } from '@ngrx/component';
import { AgGridModule } from 'ag-grid-angular';

import { CaseTableComponent } from './case-table.component';

@NgModule({
  declarations: [CaseTableComponent],
  imports: [AgGridModule, PushPipe],
  exports: [CaseTableComponent],
})
export class CaseTableModule {}
