import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AgGridModule } from 'ag-grid-angular';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CustomOverlayModule } from '@cdba/shared/components/table/custom-overlay/custom-overlay.module';
import { MaterialNumberModule } from '@cdba/shared/pipes';

import { BomMaterialDesignationCellRenderComponent } from './bom-material-designation-cell-render/bom-material-designation-cell-render.component';
import { BomTableComponent } from './bom-table.component';
import { AggregationComponentModule } from './bom-table-status-bar/aggregation/aggregation.component';
import { TotalCostShareComponentModule } from './bom-table-status-bar/total-cost-share/total-cost-share.component';
import { ColumnDefinitionService } from './config';

@NgModule({
  declarations: [BomTableComponent, BomMaterialDesignationCellRenderComponent],
  imports: [
    CommonModule,
    AgGridModule,
    CustomOverlayModule,
    TotalCostShareComponentModule,
    AggregationComponentModule,
    MaterialNumberModule,
    MatTooltipModule,
    MatIconModule,
    SharedTranslocoModule,
  ],
  providers: [ColumnDefinitionService],
  exports: [BomTableComponent],
})
export class BomTableModule {}
