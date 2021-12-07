import { NgModule } from '@angular/core';

import { AgGridModule } from '@ag-grid-community/angular';
import { CustomLoadingOverlayComponent } from '@cdba/shared/components/table/custom-overlay/custom-loading-overlay/custom-loading-overlay.component';
import { CustomNoRowsOverlayComponent } from '@cdba/shared/components/table/custom-overlay/custom-no-rows-overlay/custom-no-rows-overlay.component';
import { CustomOverlayModule } from '@cdba/shared/components/table/custom-overlay/custom-overlay.module';
import { MaterialNumberModule } from '@cdba/shared/pipes';

import { BomTableComponent } from './bom-table.component';

@NgModule({
  declarations: [BomTableComponent],
  imports: [
    AgGridModule.withComponents([
      CustomLoadingOverlayComponent,
      CustomNoRowsOverlayComponent,
    ]),
    CustomOverlayModule,
    MaterialNumberModule,
  ],
  exports: [BomTableComponent],
})
export class BomTableModule {}
