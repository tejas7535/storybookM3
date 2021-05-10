import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AgGridModule } from '@ag-grid-community/angular';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CustomStatusBarModule } from '@cdba/shared/components/table/custom-status-bar/custom-status-bar.module';

import { CompareViewButtonComponent } from '../../shared/components/table/custom-status-bar/compare-view-button/compare-view-button.component';
import { DetailViewButtonComponent } from '../../shared/components/table/custom-status-bar/detail-view-button/detail-view-button.component';
import { SharedModule } from '../../shared/shared.module';
import { PcmCellRendererComponent } from './pcm-cell-renderer/pcm-cell-renderer.component';
import { ReferenceTypesTableComponent } from './reference-types-table.component';

@NgModule({
  declarations: [ReferenceTypesTableComponent, PcmCellRendererComponent],
  imports: [
    SharedModule,
    AgGridModule.withComponents([
      DetailViewButtonComponent,
      CompareViewButtonComponent,
      PcmCellRendererComponent,
    ]),
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    CustomStatusBarModule,
    SharedTranslocoModule,
  ],
  exports: [ReferenceTypesTableComponent],
})
export class ReferenceTypesTableModule {}
