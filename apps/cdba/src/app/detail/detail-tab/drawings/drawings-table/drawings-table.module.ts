import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AgGridModule } from '@ag-grid-community/angular';

import { SharedModule } from '@cdba/shared';
import { CustomLoadingOverlayComponent } from '@cdba/shared/components/table/custom-overlay/custom-loading-overlay/custom-loading-overlay.component';
import { CustomNoRowsOverlayComponent } from '@cdba/shared/components/table/custom-overlay/custom-no-rows-overlay/custom-no-rows-overlay.component';
import { CustomOverlayModule } from '@cdba/shared/components/table/custom-overlay/custom-overlay.module';

import { ActionsCellRendererComponent } from './actions-cell-renderer/actions-cell-renderer.component';
import { DrawingsTableComponent } from './drawings-table.component';

@NgModule({
  declarations: [DrawingsTableComponent, ActionsCellRendererComponent],
  imports: [
    SharedModule,
    MatButtonModule,
    MatIconModule,
    AgGridModule.withComponents([
      CustomLoadingOverlayComponent,
      CustomNoRowsOverlayComponent,
      ActionsCellRendererComponent,
    ]),
    CustomOverlayModule,
  ],
  exports: [DrawingsTableComponent],
})
export class DrawingsTableModule {}
