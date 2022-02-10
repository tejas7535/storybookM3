import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AgGridModule } from '@ag-grid-community/angular';
import { CustomLoadingOverlayComponent } from '@cdba/shared/components/table/custom-overlay/custom-loading-overlay/custom-loading-overlay.component';
import { CustomNoRowsOverlayComponent } from '@cdba/shared/components/table/custom-overlay/custom-no-rows-overlay/custom-no-rows-overlay.component';
import { CustomOverlayModule } from '@cdba/shared/components/table/custom-overlay/custom-overlay.module';
import { MaterialNumberModule } from '@cdba/shared/pipes';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BomMaterialDesignationCellRenderComponent } from './bom-material-designation-cell-render/bom-material-designation-cell-render.component';
import { BomTableComponent } from './bom-table.component';
import {
  BomTableStatusBarComponent,
  BomTableStatusBarComponentModule,
} from './bom-table-status-bar/bom-table-status-bar.component';

@NgModule({
  declarations: [BomTableComponent, BomMaterialDesignationCellRenderComponent],
  imports: [
    CommonModule,
    AgGridModule.withComponents([
      CustomLoadingOverlayComponent,
      CustomNoRowsOverlayComponent,
      BomTableStatusBarComponent,
      BomMaterialDesignationCellRenderComponent,
    ]),
    CustomOverlayModule,
    BomTableStatusBarComponentModule,
    MaterialNumberModule,
    MatTooltipModule,
    MatIconModule,
    SharedTranslocoModule,
  ],
  exports: [BomTableComponent],
})
export class BomTableModule {}
