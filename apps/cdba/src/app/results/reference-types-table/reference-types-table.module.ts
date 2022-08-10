import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AgGridModule } from 'ag-grid-angular';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { PcmBadgeModule } from '@cdba/shared/components/pcm-badge';
import { ResultsStatusBarModule } from '@cdba/shared/components/table/status-bar/results-status-bar';

import { MaterialDesignationCellRenderComponent } from './material-designation-cell-render/material-designation-cell-render.component';
import { PcmCellRendererComponent } from './pcm-cell-renderer/pcm-cell-renderer.component';
import { ReferenceTypesTableComponent } from './reference-types-table.component';
import { TableStore } from './table.store';

@NgModule({
  declarations: [
    ReferenceTypesTableComponent,
    MaterialDesignationCellRenderComponent,
    PcmCellRendererComponent,
  ],
  imports: [
    CommonModule,
    AgGridModule,
    MatButtonModule,
    MatIconModule,
    PcmBadgeModule,
    ResultsStatusBarModule,
    SharedTranslocoModule,
  ],
  providers: [TableStore],
  exports: [ReferenceTypesTableComponent],
})
export class ReferenceTypesTableModule {}
