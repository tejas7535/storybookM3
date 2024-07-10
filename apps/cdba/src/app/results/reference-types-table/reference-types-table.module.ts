import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { PushPipe } from '@ngrx/component';
import { AgGridModule } from 'ag-grid-angular';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { PcmBadgeModule } from '@cdba/shared/components/pcm-badge';
import { PaginationControlsService } from '@cdba/shared/components/table/pagination-controls/service/pagination-controls.service';
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
    PushPipe,
    PcmBadgeModule,
    ResultsStatusBarModule,
    SharedTranslocoModule,
  ],
  providers: [TableStore, PaginationControlsService],
  exports: [ReferenceTypesTableComponent],
})
export class ReferenceTypesTableModule {}
