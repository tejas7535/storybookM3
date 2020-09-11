import { NgModule } from '@angular/core';

import { AgGridModule } from '@ag-grid-community/angular';

import { SharedModule } from '../../../shared/shared.module';
import { CustomLoadingOverlayComponent } from '../../../shared/table/custom-overlay/custom-loading-overlay/custom-loading-overlay.component';
import { CustomNoRowsOverlayComponent } from '../../../shared/table/custom-overlay/custom-no-rows-overlay/custom-no-rows-overlay.component';
import { CustomOverlayModule } from '../../../shared/table/custom-overlay/custom-overlay.module';
import { BomTableComponent } from './bom-table.component';

@NgModule({
  declarations: [BomTableComponent],
  imports: [
    SharedModule,
    AgGridModule.withComponents([
      CustomLoadingOverlayComponent,
      CustomNoRowsOverlayComponent,
    ]),
    CustomOverlayModule,
  ],
  exports: [BomTableComponent],
})
export class BomTableModule {}
