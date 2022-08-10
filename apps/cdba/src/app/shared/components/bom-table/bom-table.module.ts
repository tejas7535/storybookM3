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
import { BomTableStatusBarComponentModule } from './bom-table-status-bar/bom-table-status-bar.component';
import { ColumnDefinitionService, SidebarService } from './config';

@NgModule({
  declarations: [BomTableComponent, BomMaterialDesignationCellRenderComponent],
  imports: [
    CommonModule,
    AgGridModule,
    CustomOverlayModule,
    BomTableStatusBarComponentModule,
    MaterialNumberModule,
    MatTooltipModule,
    MatIconModule,
    SharedTranslocoModule,
  ],
  providers: [ColumnDefinitionService, SidebarService],
  exports: [BomTableComponent],
})
export class BomTableModule {}
