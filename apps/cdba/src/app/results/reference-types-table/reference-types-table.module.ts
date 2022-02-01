import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AgGridModule } from '@ag-grid-community/angular';
import { CustomStatusBarModule } from '@cdba/shared/components/table/custom-status-bar/custom-status-bar.module';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CompareResultsButtonComponent } from '../../shared/components/table/custom-status-bar/compare-results-button/compare-results-button.component';
import { DetailViewButtonComponent } from '../../shared/components/table/custom-status-bar/detail-view-button/detail-view-button.component';
import { PcmCellRendererComponent } from './pcm-cell-renderer/pcm-cell-renderer.component';
import { ReferenceTypesTableComponent } from './reference-types-table.component';
import { TableStore } from './table.store';

@NgModule({
  declarations: [ReferenceTypesTableComponent, PcmCellRendererComponent],
  imports: [
    CommonModule,
    AgGridModule.withComponents([
      DetailViewButtonComponent,
      CompareResultsButtonComponent,
      PcmCellRendererComponent,
    ]),
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    CustomStatusBarModule,
    SharedTranslocoModule,
  ],
  providers: [TableStore],
  exports: [ReferenceTypesTableComponent],
})
export class ReferenceTypesTableModule {}
