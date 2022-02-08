import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AgGridModule } from '@ag-grid-community/angular';
import {
  ResultsStatusBarComponent,
  ResultsStatusBarModule,
} from '@cdba/shared/components/table/status-bar/results-status-bar';

import { SharedTranslocoModule } from '@schaeffler/transloco';

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
    AgGridModule.withComponents([
      ResultsStatusBarComponent,
      MaterialDesignationCellRenderComponent,
      PcmCellRendererComponent,
    ]),
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    ResultsStatusBarModule,
    SharedTranslocoModule,
  ],
  providers: [TableStore],
  exports: [ReferenceTypesTableComponent],
})
export class ReferenceTypesTableModule {}
